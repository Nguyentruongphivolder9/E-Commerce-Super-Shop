package com.project.supershop.features.rating.domain.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RatingRequest {
    private MultipartFile[] imageFiles;
    private String productId;
    private String orderItemId;
    private int ratingStar;
    private String productQuality;
    private String trueDescription;
    private String comment;
}
