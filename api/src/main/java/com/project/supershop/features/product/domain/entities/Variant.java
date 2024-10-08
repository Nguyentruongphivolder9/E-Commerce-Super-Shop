package com.project.supershop.features.product.domain.entities;

import com.project.supershop.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "variants")
@NoArgsConstructor
@AllArgsConstructor
@Data
@SuperBuilder
public class Variant extends BaseEntity {
    private String name;
    private String imageUrl;
    private Boolean isActive;
    private Integer sortOrder;

    @ManyToOne
    @JoinColumn(name = "variantGroupId")
    @EqualsAndHashCode.Exclude
    private VariantGroup variantGroup;

    public static Variant createVariant(String name, String fileName, Integer sortOrder, VariantGroup variantGroup){
        return Variant.builder()
                .name(name)
                .imageUrl(fileName)
                .isActive(true)
                .sortOrder(sortOrder)
                .variantGroup(variantGroup)
                .build();
    }
}
