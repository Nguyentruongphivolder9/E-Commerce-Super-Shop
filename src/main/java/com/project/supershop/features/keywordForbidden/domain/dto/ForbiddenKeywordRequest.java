package com.project.supershop.features.keywordForbidden.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ForbiddenKeywordRequest {
    private String id;
    private String keyword;
}