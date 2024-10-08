package com.project.supershop.features.product.repositories;

import com.project.supershop.features.product.domain.entities.Category;
import com.project.supershop.features.product.domain.entities.CategoryImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoryImageRepository extends JpaRepository<CategoryImage, UUID> {
    @Query("SELECT c FROM CategoryImage c WHERE c.category.id = :categoryId")
    List<CategoryImage> findAllCategoryImagesByCategoryId(@Param("categoryId") Integer categoryId);
}
