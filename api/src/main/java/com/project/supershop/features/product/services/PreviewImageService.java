package com.project.supershop.features.product.services;

import com.project.supershop.features.product.domain.dto.responses.PreviewImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PreviewImageService {
    List<PreviewImageResponse> createPreviewImage(MultipartFile[] imageFiles) throws IOException;
    void deletePreviewImage(String id);
}
