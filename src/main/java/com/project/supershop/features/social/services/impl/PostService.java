package com.project.supershop.features.social.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.repositories.AccountRepositories;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.social.DTOs.request.PostRequest;
import com.project.supershop.features.social.mappers.Mapper;
import com.project.supershop.features.social.DTOs.response.PostResponse;
import com.project.supershop.features.social.models.AccountPostLike;
import com.project.supershop.features.social.models.Post;
import com.project.supershop.features.social.models.PostImage;
import com.project.supershop.features.social.repositories.AccountPostLikeRepository;
import com.project.supershop.features.social.repositories.PostImageRepository;
import com.project.supershop.features.social.repositories.PostRepository;
import com.project.supershop.features.social.services.IPostService;
import com.project.supershop.handler.UnprocessableException;
import com.project.supershop.services.FileUploadUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class PostService implements IPostService {

    private final Mapper<Post, PostResponse> postMapper;

    private final PostRepository postRepository;

    private final FileUploadUtils fileUploadUtils;

    private final JwtTokenService jwtTokenService;

    private final PostImageRepository postImageRepository;

    private final AccountRepositories accountRepositories;

    private final AccountPostLikeRepository accountPostLikeRepository;

    public PostService (
            Mapper<Post, PostResponse> postMapper,
            PostRepository postRepository,
            FileUploadUtils fileUploadUtils,
            JwtTokenService jwtTokenService,
            PostImageRepository postImageRepository,
            AccountRepositories accountRepositories,
            AccountPostLikeRepository accountPostLikeRepository) {
        this.postMapper = postMapper;
        this.postRepository = postRepository;
        this.fileUploadUtils = fileUploadUtils;
        this.jwtTokenService = jwtTokenService;
        this.postImageRepository = postImageRepository;
        this.accountRepositories = accountRepositories;
        this.accountPostLikeRepository = accountPostLikeRepository;
    }

    @Override
    public PostResponse getPostById (UUID postId, String jwtToken) {
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        if(currentAccount == null){
            throw new UnprocessableException("Invalid token");
        }

        Post post = postRepository.findById(postId).orElse(null);

        return postMapper.mapTo(post);
    }

    @Override
    public Page<PostResponse> getInfinitePosts (Pageable pageable) {
        return postRepository.findByOrderByCreatedAtDesc(pageable)
                .map(postMapper::mapTo);
    }

    @Override
    public Page<PostResponse> getRecentPosts (Pageable pageable, String jwtToken) {

        return postRepository.findPopularPosts(pageable)
                .map(postMapper::mapTo);
    }

    @Override
    public List<PostResponse> getRecentPostsNoPage (String jwtToken) {
        return postRepository.findPopularPostsNoPage()
                .stream()
                .map(postMapper::mapTo).toList();
    }

    @Override
    public Page<PostResponse> getSearchedPosts (String term, Pageable pageable) {
        Page<Post> posts = postRepository.search(term, pageable);
        if(term.isEmpty()){
            return postRepository.findByOrderByCreatedAtDesc(pageable)
                    .map(postMapper::mapTo);
        }
        return posts.map(postMapper::mapTo);
    }

    @Override
    @Transactional
    public PostResponse updatePost (String postId, PostRequest postRequest, String jwtToken) throws IOException {
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        if(currentAccount == null){
            throw new UnprocessableException("Invalid token");
        }

        Account creator = accountRepositories.findById(currentAccount.getId()).orElse(null);

        // Validate the creator account
        if (creator == null || !currentAccount.getId().equals(creator.getId())) {
            throw new UnprocessableException("You are not allowed to update this post");
        }

        Post existingPost = postRepository.findById(UUID.fromString(postId))
                .map(post -> {
                    Optional.ofNullable(postRequest.getCaption()).ifPresent(post::setCaption);
                    Optional.ofNullable(postRequest.getLocation()).ifPresent(post::setLocation);
                    Optional.ofNullable(postRequest.getTags()).ifPresent(post::setTags);
                    Optional.of(creator).ifPresent(post::setCreator);
                    return postRepository.save(post);
                })
                .orElseThrow(() -> new UnprocessableException("Post not found"));

        //Get old images from the post
        List<PostImage> exitingPostImages = postImageRepository.findByPost_Id(existingPost.getId());

        //delete old images in AWS cloud
        for(PostImage postImage : exitingPostImages){
            fileUploadUtils.deleteFile("posts", postImage.getImageUrl());
            postImageRepository.delete(postImage);
        }

        // Save post images and set them to the post if there are any images
        if (postRequest.getPostImages() != null && postRequest.getPostImages().length > 0) {
            List<PostImage> postImages = saveImage(postRequest.getPostImages(), existingPost);
            postImageRepository.saveAll(postImages);
            existingPost.setPostImages(postImages);
        }

        return postMapper.mapTo(existingPost);
    }

    @Override
    @Transactional
    public void deletePost (UUID postId, String jwtToken) {
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        if(currentAccount == null){
            throw new UnprocessableException("Invalid token");
        }

        Account creator = accountRepositories.findById(currentAccount.getId()).orElse(null);

        // Validate the creator account
        if (creator == null || !currentAccount.getId().equals(creator.getId())) {
            throw new UnprocessableException("You are not allowed to delete this post");
        }

        Optional<Post> post = postRepository.findById(postId);

        if (post.isEmpty()) {
            throw new UnprocessableException("Post not found");
        }

        List<PostImage> postImages = postImageRepository.findByPost_Id(postId);

        if (!postImages.isEmpty()) {
            postImageRepository.deleteAllInBatch(postImages);
        }

        //deleteImage in AWS cloud
        for(PostImage postImage : postImages){
            fileUploadUtils.deleteFile("posts", postImage.getImageUrl());
        }

        postRepository.delete(post.get());
    }

    @Override
    @Transactional
    public PostResponse createPost (PostRequest postRequest, String jwtToken) throws IOException {
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        if(currentAccount == null){
            throw new UnprocessableException("Invalid token");
        }

        if(postRequest.getCaption().isEmpty()){
            throw new UnprocessableException("Caption is required");
        }

        Post post = Post.createPost(postRequest);
        Post savedPost = postRepository.save(post);

        if (postRequest.getPostImages() != null && postRequest.getPostImages().length > 0) {
            List<PostImage> postImage = saveImage(postRequest.getPostImages(), post);
            savedPost.setPostImages(postImage);
        }

        if(postRequest.getListOfLikes( ) != null){
            List<AccountPostLike> likes = saveLikes(postRequest.getListOfLikes(), post);
            savedPost.setLikes(likes);
        }

        savedPost.setCreator(currentAccount);
        return postMapper.mapTo(savedPost);
    }

    @Override
    @Transactional
    public boolean toggleLikePost (UUID postId, String jwtToken) {
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        if(currentAccount == null){
            throw new UnprocessableException("Invalid token");
        }
        Post post = postRepository.findById(postId).orElse(null);

        if (!accountPostLikeRepository
                .existsByPost_IdAndAccount_Id(postId, currentAccount.getId( ))) {
            AccountPostLike accountPostLike = AccountPostLike
                    .createAccountPostLike(post, currentAccount);
            accountPostLikeRepository.save(accountPostLike);
            return true;
        } else if (accountPostLikeRepository.existsByPost_IdAndAccount_Id(postId, currentAccount.getId( ))) {
            accountPostLikeRepository
                    .deleteByPostAndAccount(post, currentAccount);
            return true;
        }
        return false;
    }

    @Override
    public List<PostResponse> getLikedPostsByUserId (String userId) {
        Account user = accountRepositories.findById(UUID.fromString(userId)).orElse(null);

        if (user == null) {
            throw new UnprocessableException("User not found");
        }

        List<Post> posts = postRepository.findByLikes_Account_IdOrderByCreatedAtDesc(user.getId());

        return posts.stream().map(postMapper::mapTo).toList();
    }

    @Override
    public List<PostResponse> getUserLikedPosts (UUID postId, String jwtToken) {
        return List.of( );
    }

    @Override
    public List<PostResponse> getPostsOfUser (String jwtToken) {
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        if(currentAccount == null){
            throw new UnprocessableException("Invalid token");
        }

        return postRepository.findByCreator_IdOrderByCreatedAtDesc(currentAccount.getId())
                .stream()
                .map(postMapper::mapTo).toList();
    }

    @Override
    public List<PostResponse> getPostsOfUserByUserId (String userId) {
        Optional<Account> user = accountRepositories.findById(UUID.fromString(userId));

        if (user.isEmpty( )) {
            throw new UnprocessableException("User not found");
        }

        return postRepository.findByCreator_IdOrderByCreatedAtDesc(user.get( ).getId())
                .stream()
                .map(postMapper::mapTo).toList();
    }

    @Override
    public List<PostResponse> getSavedPosts (String jwtToken) {
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        if(currentAccount == null){
            throw new UnprocessableException("Invalid token");
        }

        List<Post> posts = postRepository.findBySavePosts_Account_IdOrderByCreatedAtDesc(currentAccount.getId());
        return posts.stream().map(postMapper::mapTo).toList();
    }

    private List<PostImage> saveImage (MultipartFile[] imageFiles, Post post) throws IOException {
        List<PostImage> postImages = new ArrayList<>( ) ;

        for (MultipartFile imageFile : imageFiles) {
            String fileName = fileUploadUtils.uploadFile(imageFile, "posts");

            PostImage previewImage = PostImage.createPostImage(fileName, post);
            postImages.add(previewImage);
        }
        return postImageRepository.saveAll(postImages);
    }

    private List<AccountPostLike> saveLikes (List<String> listOfLikes, Post post) {
        List<AccountPostLike> likes = new ArrayList<>( ) ;

        for (String account : listOfLikes) {
            Account likeBy = accountRepositories.findById(UUID.fromString(account)).orElse(null);
            AccountPostLike accountPostLike = AccountPostLike.createAccountPostLike(post, likeBy);
            likes.add(accountPostLike);
        }
        return accountPostLikeRepository.saveAll(likes);
    }
}
