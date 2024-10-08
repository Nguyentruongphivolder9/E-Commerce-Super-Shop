package com.project.supershop.features.product.services.impl;

import com.project.supershop.features.product.domain.dto.responses.PreviewImageResponse;
import com.project.supershop.features.product.domain.dto.responses.ProductResponse;
import com.project.supershop.features.product.domain.entities.PreviewImage;
import com.project.supershop.features.product.repositories.PreviewImageRepository;
import com.project.supershop.features.product.services.PreviewImageService;
import com.project.supershop.handler.NotFoundException;
import com.project.supershop.services.FileUploadUtils;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PreviewImageServiceImpl implements PreviewImageService {
    private final PreviewImageRepository previewImageRepository;
    private final FileUploadUtils fileUploadUtils;
    private final ModelMapper modelMapper;

    public PreviewImageServiceImpl(PreviewImageRepository previewImageRepository, ModelMapper modelMapper, FileUploadUtils fileUploadUtils) {
        this.previewImageRepository = previewImageRepository;
        this.fileUploadUtils = fileUploadUtils;
        this.modelMapper = modelMapper;
    }

    @Override
    public List<PreviewImageResponse> createPreviewImage(MultipartFile[] imageFiles) throws IOException {
        List<PreviewImage> previewImages = new ArrayList<>();
        for (MultipartFile imageFile : imageFiles) {
            String fileName = fileUploadUtils.uploadFile(imageFile, "products");

            PreviewImage previewImage = PreviewImage.createProduct(fileName);
            previewImages.add(previewImage);
        }

        List<PreviewImage> resultCreate = previewImageRepository.saveAll(previewImages);
        List<PreviewImageResponse> previewImageResponses = resultCreate.stream()
                .map(previewImage -> modelMapper.map(previewImage, PreviewImageResponse.class))
                .collect(Collectors.toList());

        return previewImageResponses;
    }

    @Override
    public void deletePreviewImage(String id) {
        Optional<PreviewImage> previewImage = previewImageRepository.findById(UUID.fromString(id));
        if(previewImage.isEmpty()){
            throw new NotFoundException("Image does not exist");
        }
        fileUploadUtils.deleteFile("products", previewImage.get().getImageUrl());
        previewImageRepository.deleteById(UUID.fromString(id));
    }
}
