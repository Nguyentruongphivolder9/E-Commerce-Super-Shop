package com.project.supershop.features.cart.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ShopInformation {
    private String id;
    private String userName;
    private String fullName;
    private String avatarUrl;
}
