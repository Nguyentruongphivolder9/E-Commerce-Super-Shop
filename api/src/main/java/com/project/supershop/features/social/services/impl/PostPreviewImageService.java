package com.project.supershop.features.social.services.impl;


import com.project.supershop.features.social.DTOs.response.PostImageResponse;
import com.project.supershop.features.social.mappers.Mapper;

import com.project.supershop.features.social.models.Post;
import com.project.supershop.features.social.models.PostImage;
import com.project.supershop.features.social.models.PostPreviewImage;
import com.project.supershop.features.social.repositories.PostPreviewImageRepository;
import com.project.supershop.features.social.repositories.PostRepository;
import com.project.supershop.features.social.services.IPostPreviewImageService;
import com.project.supershop.services.FileUploadUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PostPreviewImageService implements IPostPreviewImageService {

    private final PostPreviewImageRepository postPreviewImageRepository;
    private final FileUploadUtils fileUploadUtils;
//    private final Mapper<PostImage, PostImageResponse> postImageMapper;
    private final PostRepository postRepository;

    public PostPreviewImageService (
            PostPreviewImageRepository postPreviewImageRepository,
            FileUploadUtils fileUploadUtils,
            PostRepository postRepository) {
        this.postPreviewImageRepository = postPreviewImageRepository;
        this.fileUploadUtils = fileUploadUtils;
        this.postRepository = postRepository;
    }

    @Override
    @Transactional
    public List<PostImageResponse> createPreviewImage (MultipartFile[] imageFiles, String postId) throws IOException {
        List<PostImage> postPreviewImages = new ArrayList<>();

        Post post = postRepository.findById(UUID.fromString(postId))
                .orElseThrow(() -> new RuntimeException("Post not found"));

        for (MultipartFile imageFile : imageFiles) {
            String fileName = fileUploadUtils.uploadFile(imageFile, "products");

            PostImage postPreviewImage = PostImage.createPostImage(fileName, post);

            postPreviewImages.add(postPreviewImage);
        }
        return List.of( );
    }

    @Override
    @Transactional
    public void deletePreviewImage (String id) {
        Optional<PostPreviewImage> postPreviewImage =
                postPreviewImageRepository.findById(UUID.fromString(id));

        if (postPreviewImage.isEmpty()) {
            throw new RuntimeException("Image does not exist");
        }

        fileUploadUtils.deleteFile("products", postPreviewImage.get().getImageUrl());
        postPreviewImageRepository.deleteById(UUID.fromString(id));
    }
}


