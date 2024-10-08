package com.project.supershop.features.product.controllers;

import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.product.domain.dto.requests.CategoryRequest;
import com.project.supershop.features.product.domain.dto.responses.CategoryResponse;
import com.project.supershop.features.product.domain.dto.responses.PreviewImageResponse;
import com.project.supershop.features.product.services.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ResultResponse<CategoryResponse>> create(@Valid @ModelAttribute CategoryRequest request) throws IOException {
        CategoryResponse result = categoryService.createCategory(request);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<CategoryResponse>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Create category successfully")
                        .statusCode(HttpStatus.CREATED.value())
                        .build());
    }

    @PutMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ResultResponse<CategoryResponse>> update(@Valid @ModelAttribute CategoryRequest request) throws IOException {
        CategoryResponse result = categoryService.createCategory(request);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<CategoryResponse>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Update category successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @GetMapping
    public ResponseEntity<ResultResponse<List<CategoryResponse>>> getAllCategory() {
        List<CategoryResponse> result = categoryService.getAllCategories();
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<List<CategoryResponse>>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Get categories successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @GetMapping("/{id}/list-relate")
    public ResponseEntity<ResultResponse<List<CategoryResponse>>> getListCategory(@PathVariable("id") String id) {
        List<CategoryResponse> result = categoryService.getListCategoriesOfExistProduct(id);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<List<CategoryResponse>>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Get list category successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultResponse<CategoryResponse>> getCtegoryById(@PathVariable("id") String id) {
        CategoryResponse result = categoryService.getCategoryById(id);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<CategoryResponse>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Get list category successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResultResponse<String>> deleteCtegoryById(@PathVariable("id") String id) {
        categoryService.deleteCategoryById(Integer.parseInt(id));
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<String>builder()
                        .body("Deleted category successfully")
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Deleted category successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }
}
