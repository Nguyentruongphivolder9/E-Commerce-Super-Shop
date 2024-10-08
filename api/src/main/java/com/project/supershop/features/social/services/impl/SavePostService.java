package com.project.supershop.features.social.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.auth.services.JwtTokenService;

import com.project.supershop.features.social.DTOs.response.PostResponse;
import com.project.supershop.features.social.DTOs.response.SavePostResponse;
import com.project.supershop.features.social.mappers.Mapper;
import com.project.supershop.features.social.models.Post;
import com.project.supershop.features.social.models.SavePost;
import com.project.supershop.features.social.repositories.PostRepository;
import com.project.supershop.features.social.repositories.SavePostRepository;
import com.project.supershop.features.social.services.ISavePostService;
import com.project.supershop.handler.UnprocessableException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class SavePostService implements ISavePostService {

    private final Mapper<Post, PostResponse> postMapper;

    private final Mapper<SavePost, SavePostResponse> savePostMapper;

    private final JwtTokenService jwtTokenService;

    private final PostRepository postRepository;

    private final SavePostRepository savePostRepository;

    public SavePostService (
            Mapper<Post, PostResponse> postMapper,
            Mapper<SavePost, SavePostResponse> savePostMapper,
            JwtTokenService jwtTokenService,
            PostRepository postRepository,
            SavePostRepository savePostRepository) {
        this.postMapper = postMapper;
        this.savePostMapper = savePostMapper;
        this.jwtTokenService = jwtTokenService;
        this.postRepository = postRepository;
        this.savePostRepository = savePostRepository;
    }

    @Override
    @Transactional
    public SavePostResponse savePost (String postId, String jwtToken) {
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        if(currentAccount == null){
            throw new UnprocessableException("Invalid token");
        }
        Post post = postRepository.findById(UUID.fromString(postId))
                .orElse(null);
        SavePost savePost = SavePost.createSavePost(currentAccount, post);
        if(savePostRepository.existsByAccount_IdAndPost_Id(currentAccount.getId(), UUID.fromString(postId))){
            throw new UnprocessableException("Post already saved");
        }
        savePostRepository.save(savePost);
        return savePostMapper.mapTo(savePost);
    }

    @Override
    @Transactional
    public boolean deleteSavePost (String postId, String jwtToken) {
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);

        if(currentAccount == null){
            throw new UnprocessableException("Invalid token");
        }

        if(savePostRepository
                .existsByAccount_IdAndPost_Id(currentAccount.getId(), UUID.fromString(postId))){
            SavePost savePost = savePostRepository
                    .findByAccount_IdAndPost_Id(currentAccount.getId(), UUID.fromString(postId));
            savePostRepository.delete(savePost);
            return true;
        }
        return false;
    }

    @Override
    public List<SavePostResponse> getSavedPosts (String jwtToken) {
        Account currentAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        if(currentAccount == null){
            throw new UnprocessableException("Invalid token");
        }

        return savePostRepository.findByAccount_IdOrderByCreatedAtDesc(currentAccount.getId())
                .stream()
                .map(savePostMapper::mapTo)
                .toList();
    }
}
