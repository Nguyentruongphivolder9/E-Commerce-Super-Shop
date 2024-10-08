package com.project.supershop.features.avatar.controller;

import com.project.supershop.features.avatar.services.AvatarService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/v1/avatar")
public class AvatarController {

    @GetMapping("/static/defaultAvatar/{folder}/{fileName:.+}")
    public ResponseEntity<?> serveAvatar( @PathVariable String folder, @PathVariable String fileName) {
        try {
            // Construct the path to the avatar image
            String fileLocation = "static/defaultAvatar/" + folder + "/" + fileName;
            Resource resource = new ClassPathResource(fileLocation);

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal error: " + e.getMessage());
        }
    }
}
