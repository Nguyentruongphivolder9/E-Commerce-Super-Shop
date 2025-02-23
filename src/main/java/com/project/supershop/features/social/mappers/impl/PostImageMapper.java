package com.project.supershop.features.social.mappers.impl;

import com.project.supershop.features.chat.DTOs.response.MessageResponse;
import com.project.supershop.features.social.mappers.Mapper;
import com.project.supershop.features.chat.models.Message;
import com.project.supershop.features.social.DTOs.response.PostImageResponse;
import com.project.supershop.features.social.models.PostImage;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.stereotype.Component;

@Component
public class PostImageMapper implements Mapper<PostImage, PostImageResponse> {

    private final ModelMapper modelMapper;

    public PostImageMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        configurePostImageMappings();
    }

    private void configurePostImageMappings() {
        // Enable field matching for private fields and other configurations
        modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        // Custom TypeMap for mapping PostImage to PostImageResponse
        TypeMap<PostImage, PostImageResponse> typeMap =
            modelMapper.createTypeMap(PostImage.class, PostImageResponse.class);
        // Custom Converter for Post to PostResponse
        typeMap.addMappings(mapper -> mapper
                .map(src-> src.getId(), PostImageResponse::setId));
        typeMap.addMappings(mapper -> mapper
            .map(PostImage::getImageUrl, PostImageResponse::setImageUrl));
        typeMap.addMappings(mapper -> mapper
            .map(src-> src.getPost().getId(), PostImageResponse::setPostId));

    }

    @Override
    public PostImageResponse mapTo (PostImage postImage) {
        return modelMapper.map(postImage, PostImageResponse.class);
    }

    @Override
    public PostImage mapFrom (PostImageResponse postImageResponse) {
        return modelMapper.map(postImageResponse, PostImage.class);
    }
}
