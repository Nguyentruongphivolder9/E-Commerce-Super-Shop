package com.project.supershop.features.social.services;

import com.project.supershop.features.product.domain.dto.responses.PreviewImageResponse;
import com.project.supershop.features.social.DTOs.response.PostImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IPostPreviewImageService {
    List<PostImageResponse> createPreviewImage(MultipartFile[] imageFiles, String postId) throws IOException;
    void deletePreviewImage(String id);
}
