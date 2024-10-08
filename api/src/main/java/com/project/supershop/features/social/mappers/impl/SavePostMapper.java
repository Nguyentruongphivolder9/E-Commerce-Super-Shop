package com.project.supershop.features.social.mappers.impl;

import com.project.supershop.features.social.DTOs.response.SavePostResponse;
import com.project.supershop.features.social.mappers.Mapper;
import com.project.supershop.features.social.models.SavePost;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.stereotype.Component;

@Component
public class SavePostMapper implements Mapper<SavePost, SavePostResponse> {

    private final ModelMapper modelMapper;

    public SavePostMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
        configures();
    }

    private void configures () {
        modelMapper.getConfiguration()
                .setFieldMatchingEnabled(true)
                .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);

        TypeMap<SavePost, SavePostResponse> typeMap = modelMapper
                .createTypeMap(SavePost.class, SavePostResponse.class);

        typeMap.addMappings(mapper -> mapper
                .map(src -> src.getId(), SavePostResponse::setId));
        typeMap.addMappings(mapper -> mapper
                .map(src -> src.getAccount().getId(), SavePostResponse::setAccountId));
        typeMap.addMappings(mapper -> mapper
                .map(src -> src.getPost().getId(), SavePostResponse::setPostId));
    }

    @Override
    public SavePostResponse mapTo (SavePost savePost) {
        return modelMapper.map(savePost, SavePostResponse.class);
    }

    @Override
    public SavePost mapFrom (SavePostResponse savePostResponse) {
        return modelMapper.map(savePostResponse, SavePost.class);
    }
}
