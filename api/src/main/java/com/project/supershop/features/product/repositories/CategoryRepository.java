package com.project.supershop.features.product.repositories;

import com.project.supershop.features.product.domain.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.categoryImages " +
            "WHERE c.parentId IS NULL AND c.isChild = :isChild ORDER BY c.createdAt DESC")
    List<Category> findAllCategoriesWithImagesByParentIdAndIsChild(@Param("isChild") Boolean isChild);
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.categoryImages WHERE c.parentId = :parentId")
    List<Category> findAllCategoriesWithImagesByParentId(@Param("parentId") String parentId);
    @Query("SELECT c FROM Category c WHERE c.parentId = :parentId AND c.name = :name")
    Optional<Category> findByNameAndParentId(@Param("parentId") String parentId, @Param("name") String name);
    @Query("SELECT c FROM Category c WHERE  c.parentId IS NULL AND c.name = :name")
    Optional<Category> findCategoryParentByName(@Param("name") String name);

    @Query("SELECT c FROM Category c " +
            "WHERE c.parentId = :parentId")
    List<Category> findListCategoryParentOfExistProduct(@Param("parentId") String parentId);
    @Query("SELECT c FROM Category c WHERE c.parentId LIKE CONCAT('%', :parentId, '%')")
    List<Category> findAllCategoriesChildByParentId(@Param("parentId") String parentId);
}
