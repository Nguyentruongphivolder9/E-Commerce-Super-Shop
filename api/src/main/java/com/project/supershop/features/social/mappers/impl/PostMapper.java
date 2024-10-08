package com.project.supershop.features.social.mappers.impl;

import com.project.supershop.features.social.DTOs.response.AccountPostLikeResponse;
import com.project.supershop.features.social.DTOs.response.PostImageResponse;
import com.project.supershop.features.social.DTOs.response.PostResponse;
import com.project.supershop.features.social.mappers.Mapper;
import com.project.supershop.features.social.models.AccountPostLike;
import com.project.supershop.features.social.models.Post;
import com.project.supershop.features.social.models.PostImage;
import com.project.supershop.features.social.repositories.AccountPostLikeRepository;
import org.modelmapper.AbstractConverter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PostMapper implements Mapper<Post, PostResponse> {

    private final ModelMapper modelMapper;

    private final AccountPostLikeRepository accountPostLikeRepository;

    public PostMapper(
            ModelMapper modelMapper,
            AccountPostLikeRepository accountPostLikeRepository) {
        this.modelMapper = modelMapper;
        this.accountPostLikeRepository = accountPostLikeRepository;
        configurePostMappings();
    }

    private void configurePostMappings() {

        // Enable field matching for private fields and other configurations
        modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        // Custom TypeMap for mapping Post to PostResponse
        TypeMap<Post, PostResponse> typeMap = modelMapper
                .createTypeMap(Post.class, PostResponse.class);

        // Custom Converter for Creator
        typeMap.addMappings(mapper -> mapper
                .map(src -> src.getCreator().getId(), PostResponse::setCreatorId));
        typeMap.addMappings(mapper -> mapper
                .map(src -> src.getCreator().getUserName(), PostResponse::setCreatorName));
        typeMap.addMappings(mapper -> mapper
                .map(src -> src.getCreator().getAvatarUrl(), PostResponse::setCreatorAvatarUrl));
        typeMap.addMappings(mapper -> mapper
                .map(src -> src.getCreatedAt(), PostResponse::setCreatedAt));
        typeMap.addMappings(mapper -> mapper
                .map(src -> src.getUpdatedAt(), PostResponse::setUpdatedAt));

        // Custom Converter for List<PostImage> to List<PostImageResponse>
        typeMap.addMappings(mapper ->
                        mapper.using(new PostImagesListConverter())
                        .map(Post::getPostImages, PostResponse::setPostImageResponses));

        // Custom Converter for List<AccountPostLike> to List<AccountResponse>
        typeMap.addMappings(mapper ->
                        mapper.using(new AccountsListConverter())
                        .map(Post::getLikes, PostResponse::setLikes));
    }

    // Custom converter to map List<AccountPostLike> likes to List<AccountPostLikeResponse> likes
    private static class AccountsListConverter extends AbstractConverter<List<AccountPostLike>, List<AccountPostLikeResponse>> {
        @Override
        protected List<AccountPostLikeResponse> convert(List<AccountPostLike> likes) {
            if (likes == null) {
                return List.of(); // Return an empty list if likes is null
            }
            return likes.stream()
                    .map(accountPostLike -> {
                        AccountPostLikeResponse accountPostLikeResponse = new AccountPostLikeResponse();
                        accountPostLikeResponse.setId(String.valueOf(accountPostLike.getId()));
                        accountPostLikeResponse.setAccountId(String.valueOf(accountPostLike.getAccount().getId()));
                        accountPostLikeResponse.setPostId(String.valueOf(accountPostLike.getPost().getId()));
                        accountPostLikeResponse.setAccountName(accountPostLike.getAccount().getUserName());
                        accountPostLikeResponse.setAccountAvatarUrl(accountPostLike.getAccount().getAvatarUrl());
                        accountPostLikeResponse.setCreatedAt(String.valueOf(accountPostLike.getCreatedAt()));
                        accountPostLikeResponse.setUpdatedAt(String.valueOf(accountPostLike.getUpdatedAt()));
                        return accountPostLikeResponse;
                    })
                    .collect(Collectors.toList());
        }
    }

    // Custom converter to map List<PostImage> to List<PostImageResponse>
    private static class PostImagesListConverter extends AbstractConverter<List<PostImage>, List<PostImageResponse>> {
        @Override
        protected List<PostImageResponse> convert(List<PostImage> postImages) {
            if (postImages == null) {
                return List.of(); // Return an empty list if postImages is null
            }
            return postImages.stream()
                    .map(postImage -> {
                        PostImageResponse postImageResponse = new PostImageResponse();
                        postImageResponse.setId(String.valueOf(postImage.getId()));
                        postImageResponse.setImageUrl(postImage.getImageUrl());
                        postImageResponse.setPostId(String.valueOf(postImage.getPost().getId()));
                        return postImageResponse;
                    })
                    .collect(Collectors.toList());
        }
    }

    @Override
    public PostResponse mapTo (Post post) {
        return modelMapper.map(post, PostResponse.class);
    }

    @Override
    public Post mapFrom (PostResponse postResponse) {
        return modelMapper.map(postResponse, Post.class);
    }
}
