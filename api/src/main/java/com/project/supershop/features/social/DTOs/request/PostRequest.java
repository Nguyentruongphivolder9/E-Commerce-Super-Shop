package com.project.supershop.features.social.DTOs.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PostRequest {
    private String id;
    private String caption;
    private String creatorId;
    private String location;
    private String tags;
    private List<String> listOfLikes;
    private MultipartFile[] postImages;
}
