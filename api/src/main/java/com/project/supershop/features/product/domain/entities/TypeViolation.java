package com.project.supershop.features.product.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.product.domain.dto.requests.ProductViolationRequest;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.joda.time.DateTime;

@Entity
@Table(name = "typeViolations")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class TypeViolation extends BaseEntity {
    private String title;

    public static TypeViolation createTypeViolation(String title){
        return TypeViolation.builder()
                .title(title)
                .build();
    }
}
