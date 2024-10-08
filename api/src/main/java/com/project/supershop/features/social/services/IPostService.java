package com.project.supershop.features.social.services;

import com.project.supershop.features.social.DTOs.request.PostRequest;
import com.project.supershop.features.social.DTOs.response.PostResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

public interface IPostService {
    PostResponse getPostById(UUID postId, String jwtToken);

    Page<PostResponse> getInfinitePosts(Pageable pageable);

    Page<PostResponse> getRecentPosts(Pageable pageable, String jwtToken);

    List<PostResponse> getRecentPostsNoPage(String jwtToken);

    Page<PostResponse> getSearchedPosts(String term, Pageable pageable);

    //update Post
    PostResponse updatePost(String postId, PostRequest postRequest, String jwtToken) throws IOException;

    //delete Post
    void deletePost(UUID postId, String jwtToken);

    //create Post
    PostResponse createPost(PostRequest postRequest, String jwtToken) throws IOException;

    //like/unlike Post
    boolean toggleLikePost(UUID postId, String jwtToken);

    List<PostResponse> getLikedPostsByUserId (String userId);

    //get Liked Posts
    List<PostResponse> getUserLikedPosts(UUID postId, String jwtToken);

    //get User of Posts
    List<PostResponse> getPostsOfUser(String jwtToken);

    List<PostResponse> getPostsOfUserByUserId (String userId);

    //get Users Saved Posts
    List<PostResponse> getSavedPosts(String jwtToken);
}
