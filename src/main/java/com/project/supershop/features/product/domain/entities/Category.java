package com.project.supershop.features.product.domain.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.product.domain.dto.requests.CategoryRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "categories")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
@EntityListeners(AuditingEntityListener.class)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "category_seq")
    @SequenceGenerator(name = "category_seq", sequenceName = "category_sequence", allocationSize = 1, initialValue = 1000000)
    private Integer id;

    private String name;
    private String parentId;
    private Boolean isActive;
    private Boolean isChild;
    @CreatedDate
    @Column(nullable = false, updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<CategoryImage> categoryImages;

    public static Category createCategory(CategoryRequest categoryRequest){
        return Category.builder()
                .name(categoryRequest.getName())
                .parentId(categoryRequest.getParentId() != null && !categoryRequest.getParentId().isEmpty() ? categoryRequest.getParentId() : null)
                .isActive(Boolean.parseBoolean(categoryRequest.getIsActive()))
                .isChild(Boolean.parseBoolean(categoryRequest.getIsChild()))
                .build();
    }

    public static Integer checkParentIdNull(String parentId) {
        if(!parentId.isEmpty()){
            return Integer.parseInt(parentId);
        }
        return null;
    }
}
