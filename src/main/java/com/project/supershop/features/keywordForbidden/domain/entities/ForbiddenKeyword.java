package com.project.supershop.features.keywordForbidden.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.keywordForbidden.domain.dto.ForbiddenKeywordRequest;
import com.project.supershop.features.product.domain.dto.requests.ProductViolationRequest;
import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.product.domain.entities.TypeViolation;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "forbiddenKeywords")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class ForbiddenKeyword extends BaseEntity {
    private String keyword;

    public static ForbiddenKeyword createForbiddenKeyword(ForbiddenKeywordRequest request){
        return ForbiddenKeyword.builder()
                .keyword(request.getKeyword())
                .build();
    }
}
