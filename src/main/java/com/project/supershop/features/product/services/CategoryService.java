package com.project.supershop.features.product.services;

import com.project.supershop.features.product.domain.dto.requests.CategoryRequest;
import com.project.supershop.features.product.domain.dto.responses.CategoryResponse;

import java.io.IOException;
import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest categoryRequest) throws IOException;
    List<CategoryResponse> getAllCategories();
    void deleteCategoryById(Integer id);
    List<CategoryResponse> getListCategoriesOfExistProduct(String categoryId);
    CategoryResponse getCategoryById(String categoryId);
}
