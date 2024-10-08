package com.project.supershop.features.social.services;

import com.project.supershop.features.social.DTOs.response.PostResponse;
import com.project.supershop.features.social.DTOs.response.SavePostResponse;

import java.util.List;

public interface ISavePostService {
    SavePostResponse savePost(String postId, String jwtToken);

    boolean deleteSavePost (String postId, String jwtToken);

    List<SavePostResponse> getSavedPosts(String jwtToken);
}
