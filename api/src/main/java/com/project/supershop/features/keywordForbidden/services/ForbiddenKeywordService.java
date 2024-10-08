package com.project.supershop.features.keywordForbidden.services;

import com.project.supershop.features.keywordForbidden.domain.dto.ForbiddenKeywordRequest;
import com.project.supershop.features.keywordForbidden.domain.dto.ForbiddenKeywordResponse;

import java.util.List;

public interface ForbiddenKeywordService {
    ForbiddenKeywordResponse createForbiddenKeyword(ForbiddenKeywordRequest formRequest);
    ForbiddenKeywordResponse editForbiddenKeyword(ForbiddenKeywordRequest formRequest);
    List<ForbiddenKeywordResponse> getListProduct();
    void deleteListForbiddenKeyword(List<String> forbiddenKeywordIds);
}
