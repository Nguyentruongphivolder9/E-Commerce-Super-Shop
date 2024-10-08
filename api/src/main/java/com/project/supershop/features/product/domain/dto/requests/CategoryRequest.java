package com.project.supershop.features.product.domain.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CategoryRequest {
    private String id;
    @NotBlank(message = "name can not null")
    @Size(min = 1, max = 120, message = "name must be between 1 and 120 characters")
    private String name;
    @NotNull(message = "parentId can not null")
    private String parentId;
    @NotBlank(message = "isActive can not null")
    private String isActive;
    @NotBlank(message = "isChild can not null")
    private String isChild;

    private MultipartFile[] imageFiles;
}
