package com.project.supershop.features.keywordForbidden.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ForbiddenKeywordResponse {
    private String id;
    private String keyword;
    private String createdAt;
    private String updatedAt;
}