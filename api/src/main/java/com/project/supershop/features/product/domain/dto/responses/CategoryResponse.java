package com.project.supershop.features.product.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CategoryResponse {
    private String id;
    private String name;
    private String parentId;
    private Boolean isActive;
    private Boolean isChild;
    private Boolean isDelete;

    private List<CategoryResponse> categoriesChild;
    private List<CategoryImageResponse> categoryImages;
}
