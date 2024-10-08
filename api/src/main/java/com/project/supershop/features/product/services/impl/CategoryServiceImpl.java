package com.project.supershop.features.product.services.impl;

import com.project.supershop.features.product.domain.dto.requests.CategoryRequest;
import com.project.supershop.features.product.domain.dto.responses.CategoryResponse;
import com.project.supershop.features.product.domain.entities.Category;
import com.project.supershop.features.product.domain.entities.CategoryImage;
import com.project.supershop.features.product.repositories.CategoryImageRepository;
import com.project.supershop.features.product.repositories.CategoryRepository;
import com.project.supershop.features.product.repositories.ProductRepository;
import com.project.supershop.features.product.services.CategoryService;
import com.project.supershop.handler.ConflictException;
import com.project.supershop.handler.NotFoundException;
import com.project.supershop.handler.UnprocessableException;
import com.project.supershop.services.FileUploadUtils;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryImageRepository categoryImageRepository;
    private final FileUploadUtils fileUploadUtils;
    private final ModelMapper modelMapper;
    private final ProductRepository productRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, CategoryImageRepository categoryImageRepository, FileUploadUtils fileUploadUtils, ModelMapper modelMapper, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.categoryImageRepository = categoryImageRepository;
        this.fileUploadUtils = fileUploadUtils;
        this.modelMapper = modelMapper;
        this.productRepository = productRepository;
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest categoryRequest) throws IOException {
        if(categoryRequest.getParentId() != null && !categoryRequest.getParentId().isEmpty()){
            Optional<Category> resultFindByName = categoryRepository.findByNameAndParentId(categoryRequest.getParentId(), categoryRequest.getName());
            if(categoryRequest.getId() != null && !categoryRequest.getId().isEmpty()) {
                Optional<Category> categoryOptional = categoryRepository.findById(Integer.parseInt(categoryRequest.getId()));
                if(categoryOptional.isPresent()
                    && !categoryRequest.getName().equals(categoryOptional.get().getName())
                    && resultFindByName.isPresent()
                ) {
                    throw new ConflictException("Duplicate category name: " + categoryRequest.getName());
                }
            } else {
                if(resultFindByName.isPresent()){
                    throw new ConflictException("Duplicate category name: " + categoryRequest.getName());
                }
            }

            // kiểm tra parentId có tồn tại
            List<String> listCategoryParentId = Arrays.stream(categoryRequest.getParentId().split("\\.")).toList();
            if(!listCategoryParentId.isEmpty()){
                for (String categoryParentId : listCategoryParentId){
                    if(!categoryParentId.isEmpty()) {
                        Optional<Category> resultFindById = categoryRepository.findById(Integer.parseInt(categoryParentId));
                        if (resultFindById.isEmpty()) {
                            throw new NotFoundException(categoryRequest.getParentId() + " does not exist");
                        } else {
                            if(!resultFindById.get().getIsChild()) {
                                throw new NotFoundException(categoryRequest.getParentId() + " is not allowed to contain child elements");
                            }
                        }
                    }
                }
            }
        } else {
            Optional<Category> resultFindByName = categoryRepository.findCategoryParentByName(categoryRequest.getName());
            if(resultFindByName.isPresent()){
                throw new ConflictException("Duplicate category name: " + categoryRequest.getName());
            }
        }

        if(!categoryRequest.getIsActive().equals("true") && !categoryRequest.getIsActive().equals("false")){
            throw new UnprocessableException("The isActive field must be 'true' or 'false'");
        }

        if(!categoryRequest.getIsChild().equals("true") && !categoryRequest.getIsChild().equals("false")){
            throw new UnprocessableException("The isChild field must be 'true' or 'false'");
        }

        Category resultCategory;
        if(categoryRequest.getId() != null && !categoryRequest.getId().isEmpty()) {
            Optional<Category> categoryOptional = categoryRepository.findById(Integer.parseInt(categoryRequest.getId()));
            if(categoryOptional.isPresent()) {
                Category categoryUpdate = categoryOptional.get();
                categoryUpdate.setName(categoryRequest.getName());
                categoryUpdate.setParentId(categoryRequest.getParentId());
                categoryUpdate.setIsActive(Boolean.parseBoolean(categoryRequest.getIsActive()));
                categoryUpdate.setIsChild(Boolean.parseBoolean(categoryRequest.getIsChild()));
                resultCategory = categoryRepository.save(categoryUpdate);
            } else {
                Category category = Category.createCategory(categoryRequest);
                resultCategory = categoryRepository.save(category);
            }
        } else {
            Category category = Category.createCategory(categoryRequest);
            resultCategory = categoryRepository.save(category);
        }


        if(categoryRequest.getIsChild().equals("false")){
            if (categoryRequest.getId() == null) {
                if (categoryRequest.getImageFiles().length != 3) {
                    throw new UnprocessableException("The imageFiles field must contain exactly 3 files");
                }

                List<CategoryImage> listImage = saveImage(categoryRequest.getImageFiles(), resultCategory);
                resultCategory.setCategoryImages(listImage);
            } else {
                if (categoryRequest.getImageFiles() != null && categoryRequest.getImageFiles().length > 0) {
                    if (categoryRequest.getImageFiles().length != 3) {
                        throw new UnprocessableException("The imageFiles field must contain exactly 3 files");
                    }
                    List<CategoryImage> existingImages = categoryImageRepository.findAllCategoryImagesByCategoryId(Integer.parseInt(categoryRequest.getId()));
                    if (!existingImages.isEmpty()) {
                        for (CategoryImage image : existingImages) {
                            fileUploadUtils.deleteFile("categories", image.getImageUrl());
                        }
                        categoryImageRepository.deleteAllInBatch(existingImages);
                    }

                    List<CategoryImage> listImage = saveImage(categoryRequest.getImageFiles(), resultCategory);
                    resultCategory.setCategoryImages(listImage);
                }
            }
        } else {
            if (categoryRequest.getId() == null) {
                if (categoryRequest.getParentId() == null || categoryRequest.getParentId().isEmpty()) {
                    if (categoryRequest.getImageFiles() != null) {
                        if(categoryRequest.getImageFiles().length != 1) {
                            throw new UnprocessableException("The imageFiles field must contain exactly 1 file for a parent category");
                        }

                        List<CategoryImage> categoryImage = saveImage(categoryRequest.getImageFiles(), resultCategory);
                        resultCategory.setCategoryImages(categoryImage);
                    }
                }
            } else {
                List<CategoryImage> existingImages = categoryImageRepository.findAllCategoryImagesByCategoryId(Integer.parseInt(categoryRequest.getId()));

                if (categoryRequest.getImageFiles() != null && categoryRequest.getImageFiles().length > 0) {
                    if (categoryRequest.getImageFiles().length != 1) {
                        throw new UnprocessableException("The imageFiles field must contain exactly 1 file for a parent category");
                    }

                    if (!existingImages.isEmpty()) {
                        for (CategoryImage image : existingImages) {
                            fileUploadUtils.deleteFile("categories", image.getImageUrl());
                        }
                        categoryImageRepository.deleteAllInBatch(existingImages);
                    }

                    List<CategoryImage> newImages = saveImage(categoryRequest.getImageFiles(), resultCategory);
                    resultCategory.setCategoryImages(newImages);
                }
            }
        }

        CategoryResponse result = modelMapper.map(resultCategory, CategoryResponse.class);
        result.setIsDelete(true);
        return result;
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        List<Category> categoriesLevel1 = categoryRepository.findAllCategoriesWithImagesByParentIdAndIsChild(true);
        return categoriesLevel1.stream()
                .map(result -> {
                    CategoryResponse response = mapCategoryToResponse(result);
                    int countProduct = productRepository.countProductByCategoryId(result.getId().toString());
                    response.setIsDelete(countProduct == 0);
                    return response;
                })
                .collect(Collectors.toList());
    }


    private Category checkCategoryById(Integer id) {
        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if(optionalCategory.isEmpty()){
            throw new NotFoundException("Category does not exists in database.");
        }
        return optionalCategory.get();
    }

    @Override
    public void deleteCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NotFoundException(id + " does not exist"));

        int countProduct = productRepository.countProductByCategoryId(category.getParentId());
        if (countProduct != 0) {
            throw new ConflictException("Cannot delete category because it has related products.");
        }

        List<Category> categoryChildList = categoryRepository.findAllCategoriesChildByParentId(category.getId().toString());
        if (!categoryChildList.isEmpty()) {
            for (Category categoryChild : categoryChildList) {
                System.out.println("bo categoryId con: " + categoryChild.getParentId().toString());
                List<CategoryImage> imagesCategoryChild = categoryImageRepository.findAllCategoryImagesByCategoryId(categoryChild.getId());
                if (!imagesCategoryChild.isEmpty()) {
                    for (CategoryImage imageCategoryChild : imagesCategoryChild) {
                        fileUploadUtils.deleteFile("categories", imageCategoryChild.getImageUrl());
                    }
                    categoryImageRepository.deleteAllInBatch(imagesCategoryChild);
                }
            }
            categoryRepository.deleteAllInBatch(categoryChildList);
        }

        List<CategoryImage> imagesCategory = categoryImageRepository.findAllCategoryImagesByCategoryId(id);
        if (!imagesCategory.isEmpty()) {
            for (CategoryImage categoryImage : imagesCategory) {
                fileUploadUtils.deleteFile("categories", categoryImage.getImageUrl());
            }
            categoryImageRepository.deleteAllInBatch(imagesCategory);
        }

        categoryRepository.delete(category);
    }


    @Override
    public List<CategoryResponse> getListCategoriesOfExistProduct(String categoryId) {
        if (categoryId.isEmpty()) {
            return Collections.emptyList();
        }

        List<Category> listCategoryParent = new ArrayList<>();
        List<String> categoryListStrings = Arrays.stream(categoryId.split("\\.")).toList();

        if (categoryListStrings.size() > 1) {
            String parentId = categoryListStrings.get(categoryListStrings.size() - 2);
            Category category = checkCategoryById(Integer.parseInt(parentId));
            System.out.println(parentId);
            listCategoryParent.add(category);
            listCategoryParent.addAll(categoryRepository.findListCategoryParentOfExistProduct(category.getId().toString()));
        } else {
            Category category = checkCategoryById(Integer.parseInt(categoryId));
            listCategoryParent.add(category);
            listCategoryParent.addAll(categoryRepository.findListCategoryParentOfExistProduct(categoryId));
        }

        // Chuyển đổi danh sách Category sang CategoryResponse
        return listCategoryParent.stream()
                .map(src -> modelMapper.map(src, CategoryResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse getCategoryById(String categoryId) {
        Optional<Category> categoryOptional = categoryRepository.findById(Integer.parseInt(categoryId));

        if (categoryOptional.isEmpty()) {
            throw new NotFoundException("Category with ID " + categoryId + " not found.");
        }

        Category category = categoryOptional.get();
        return modelMapper.map(category, CategoryResponse.class);
    }

    private List<CategoryImage> saveImage(MultipartFile[] imageFiles, Category category) throws IOException {
        List<CategoryImage> categoryImages = new ArrayList<>();
        for (MultipartFile imageFile : imageFiles) {
            String fileName = fileUploadUtils.uploadFile(imageFile, "categories");

            CategoryImage previewImage = CategoryImage.createCategoryImage(fileName, category);
            categoryImages.add(previewImage);
        }
        return categoryImageRepository.saveAll(categoryImages);
    }

    private CategoryResponse mapCategoryToResponse(Category category) {
        CategoryResponse response = modelMapper.map(category, CategoryResponse.class);
        List<Category> childCategories = categoryRepository.findAllCategoriesWithImagesByParentId(
                category.getParentId() == null ? category.getId().toString() : category.getParentId() + "." + category.getId() 
        );

        if (!childCategories.isEmpty()) {
            List<CategoryResponse> childResponses = childCategories.stream()
                    .map(this::mapCategoryToResponse)
                    .collect(Collectors.toList());
            response.setCategoriesChild(childResponses);
        }

        int countProduct = productRepository.countProductByCategoryId(category.getId().toString());
        response.setIsDelete(countProduct == 0);

        return response;
    }
}
