package com.project.supershop.features.product.controllers;

import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.product.domain.dto.responses.PreviewImageResponse;
import com.project.supershop.features.product.services.PreviewImageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/preview-images")
public class PreviewImageController {
    private final PreviewImageService previewImageService;

    public PreviewImageController(PreviewImageService previewImageService) {
        this.previewImageService = previewImageService;
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResultResponse> createAuthor(@RequestParam("imageFiles") MultipartFile[] imageFiles) throws IOException {
        List<PreviewImageResponse> result = previewImageService.createPreviewImage(imageFiles);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.builder()
                        .body(result)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Create preview image successfully")
                        .statusCode(HttpStatus.CREATED.value())
                        .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResultResponse> deleteAuthor(@PathVariable("id") String id) {
        System.out.println("Id image: " + id);
        previewImageService.deletePreviewImage(id);
        return ResponseEntity.status(HttpStatus.OK).body(
                ResultResponse.builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Delete preview image " + id + " successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }
}
