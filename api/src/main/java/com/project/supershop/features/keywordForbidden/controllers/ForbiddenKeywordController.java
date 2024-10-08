package com.project.supershop.features.keywordForbidden.controllers;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.keywordForbidden.domain.dto.ForbiddenKeywordRequest;
import com.project.supershop.features.keywordForbidden.domain.dto.ForbiddenKeywordResponse;
import com.project.supershop.features.keywordForbidden.services.ForbiddenKeywordService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/forbidden-keyword")
public class ForbiddenKeywordController {
    private final ForbiddenKeywordService forbiddenKeywordService;

    public ForbiddenKeywordController(ForbiddenKeywordService forbiddenKeywordService) {
        this.forbiddenKeywordService = forbiddenKeywordService;
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ResultResponse<ForbiddenKeywordResponse>> create(@Valid @ModelAttribute ForbiddenKeywordRequest request) {
        ForbiddenKeywordResponse result = forbiddenKeywordService.createForbiddenKeyword(request);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<ForbiddenKeywordResponse>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Create category successfully")
                        .statusCode(HttpStatus.CREATED.value())
                        .build());
    }

    @GetMapping
    public ResponseEntity<ResultResponse<List<ForbiddenKeywordResponse>>> getListProductForAdmin() {
        List<ForbiddenKeywordResponse> result = forbiddenKeywordService.getListProduct();
        ResultResponse<List<ForbiddenKeywordResponse>> response = ResultResponse.<List<ForbiddenKeywordResponse>>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ResultResponse<ForbiddenKeywordResponse>> edit(@Valid @ModelAttribute ForbiddenKeywordRequest request) {
        ForbiddenKeywordResponse result = forbiddenKeywordService.editForbiddenKeyword(request);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<ForbiddenKeywordResponse>builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Create category successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @PostMapping("/delete-list")
    public ResponseEntity<ResultResponse<String>> deleteListForbiddenKeyword(
            @RequestBody List<String> forbiddenKeywordIds) {
        forbiddenKeywordService.deleteListForbiddenKeyword(forbiddenKeywordIds);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<String>builder()
                        .body("Deleted successfully")
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Create category successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }
}
