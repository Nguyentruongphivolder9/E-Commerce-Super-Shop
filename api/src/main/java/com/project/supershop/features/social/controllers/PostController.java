package com.project.supershop.features.social.controllers;

import com.project.supershop.features.social.DTOs.request.PostRequest;
import com.project.supershop.features.social.DTOs.response.PostResponse;
import com.project.supershop.features.social.DTOs.response.SavePostResponse;
import com.project.supershop.features.social.services.IPostPreviewImageService;
import com.project.supershop.features.social.services.IPostService;
import com.project.supershop.features.social.services.ISavePostService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import com.project.supershop.common.ResultResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/social")
public class PostController {

    private final ISavePostService savePostService;
    private final IPostPreviewImageService postImageService;
    private final IPostService postService;

    public PostController (
            ISavePostService savePostService,
            IPostPreviewImageService postImageService1,
            IPostService postService) {
        this.savePostService = savePostService;
        this.postImageService = postImageService1;
        this.postService = postService;
    }

    @RequestMapping( value="/create_post" ,method = RequestMethod.POST, consumes = {"multipart/form-data"} )
    public ResponseEntity<ResultResponse<PostResponse>> createPost (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            @Valid @ModelAttribute PostRequest postRequest
    ) throws IOException {
        PostResponse postResponse = postService.createPost(postRequest, jwtToken);

        ResultResponse<PostResponse> response = ResultResponse.<PostResponse>builder()
                .body(postResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Post created successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.created(URI.create("")).body(response);
    }

    @RequestMapping( value="/update_post/{id}" ,method = RequestMethod.POST, consumes = {"multipart/form-data"} )
    public ResponseEntity<ResultResponse<PostResponse>> updatePost (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            @PathVariable("id") String id,
            @Valid @ModelAttribute PostRequest postRequest
    ) throws IOException {
        PostResponse postResponse = postService.updatePost(id, postRequest, jwtToken);

        return ResponseEntity.ok(ResultResponse.<PostResponse>builder()
                .body(postResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Post updated successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping( value="/get_infinite_posts" ,method = RequestMethod.GET )
    public ResponseEntity<ResultResponse<Page<PostResponse>>> getInfinitePosts (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            Pageable pageable
    ) {
        Page<PostResponse> postResponses = postService.getInfinitePosts(pageable);

        return ResponseEntity.ok(ResultResponse.<Page<PostResponse>>builder()
                .body(postResponses)
                .timeStamp(LocalDateTime.now().toString())
                .message("Posts fetched successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping( value="/get_recent_posts" ,method = RequestMethod.GET )
    public ResponseEntity<ResultResponse<Page<PostResponse>>> getRecentPosts (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            Pageable pageable
    ) {
        Page<PostResponse> postResponses = postService.getRecentPosts(pageable, jwtToken);

        return ResponseEntity.ok(ResultResponse.<Page<PostResponse>>builder()
                .body(postResponses)
                .timeStamp(LocalDateTime.now().toString())
                .message("Recent posts fetched successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping( value="/mobile/get_recent_posts" ,method = RequestMethod.GET )
    public ResponseEntity<ResultResponse<List<PostResponse>>> getRecentPostsNoPage (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken
    ) {
        List<PostResponse> postResponses = postService.getRecentPostsNoPage(jwtToken);

        return ResponseEntity.ok(ResultResponse.<List<PostResponse>>builder()
                .body(postResponses)
                .timeStamp(LocalDateTime.now().toString())
                .message("Recent posts no page fetched successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping( value="/get_post/{id}" ,method = RequestMethod.GET )
    public ResponseEntity<ResultResponse<PostResponse>> getPost (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            @PathVariable("id") String id
    ) {
        PostResponse postResponse = postService.getPostById(UUID.fromString(id), jwtToken);

        return ResponseEntity.ok(ResultResponse.<PostResponse>builder()
                .body(postResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Post by id fetched successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping( value="/get_posts_of_user" ,method = RequestMethod.GET )
    public ResponseEntity<ResultResponse<List<PostResponse>>> getPostsOfUser (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken
    ) {
        List<PostResponse> postResponses = postService.getPostsOfUser( jwtToken);

        return ResponseEntity.ok(ResultResponse.<List<PostResponse>>builder()
                .body(postResponses)
                .timeStamp(LocalDateTime.now().toString())
                .message("Posts of current user fetched successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping( value="/get_posts_of_user_by_id/{id}" ,method = RequestMethod.GET )
    public ResponseEntity<ResultResponse<List<PostResponse>>> getPostsOfUserByUserId (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            @PathVariable("id") String id
    ) {
        List<PostResponse> postResponses = postService.getPostsOfUserByUserId(id);

        return ResponseEntity.ok(ResultResponse.<List<PostResponse>>builder()
                .body(postResponses)
                .timeStamp(LocalDateTime.now().toString())
                .message("Posts of user fetched successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping( value="/search_posts" ,method = RequestMethod.GET )
    public ResponseEntity<ResultResponse<Page<PostResponse>>> searchPosts (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            @RequestParam( name = "term" ) String term,
            Pageable pageable
    ) {
        Page<PostResponse> postResponses = postService.getSearchedPosts(term, pageable);

        return ResponseEntity.ok(ResultResponse.<Page<PostResponse>>builder()
                .body(postResponses)
                .timeStamp(LocalDateTime.now().toString())
                .message("Search posts fetched successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping( value="/toggle_like/{id}" ,method = RequestMethod.POST )
    public ResponseEntity<ResultResponse<Boolean>> togglePost (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            @PathVariable("id") String id
    ) {
        boolean isLiked = postService.toggleLikePost(UUID.fromString(id), jwtToken);

        return ResponseEntity.ok(ResultResponse.<Boolean>builder()
                .body(isLiked)
                .timeStamp(LocalDateTime.now().toString())
                .message("Post toggle like successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping( value="/get_liked_posts/{id}" ,method = RequestMethod.GET )
    public ResponseEntity<ResultResponse<List<PostResponse>>> getLikedPostsByUserId (
            @PathVariable("id") String id
    ) {
        List<PostResponse> postResponses = postService.getLikedPostsByUserId(id);

        return ResponseEntity.ok(ResultResponse.<List<PostResponse>>builder()
                .body(postResponses)
                .timeStamp(LocalDateTime.now().toString())
                .message("Liked posts fetched successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping( value="/save_post/{id}" ,method = RequestMethod.POST )
    public ResponseEntity<ResultResponse<SavePostResponse>> savePost (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            @PathVariable("id") String id
    ) {
        SavePostResponse postResponse = savePostService.savePost(id, jwtToken);

        return ResponseEntity.ok(ResultResponse.<SavePostResponse>builder()
                .body(postResponse)
                .timeStamp(LocalDateTime.now().toString())
                .message("Post saved successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping( value="/delete_save_post/{id}" ,method = RequestMethod.DELETE )
    public ResponseEntity<ResultResponse<Boolean>> getPostImage (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            @PathVariable("id") String id
    ) {
        boolean isDeleted = savePostService.deleteSavePost(id, jwtToken);

        return ResponseEntity.ok(ResultResponse.<Boolean>builder()
                .body(isDeleted)
                .timeStamp(LocalDateTime.now().toString())
                .message("Delete saved post successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping( value="/get_saved_id_posts" ,method = RequestMethod.GET )
    public ResponseEntity<ResultResponse<List<SavePostResponse>>> getSavedIdPosts (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken
    ) {
        List<SavePostResponse> postResponses = savePostService.getSavedPosts(jwtToken);

        return ResponseEntity.ok(ResultResponse.<List<SavePostResponse>>builder()
                .body(postResponses)
                .timeStamp(LocalDateTime.now().toString())
                .message("Saved id posts fetched successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping( value="/get_saved_posts" ,method = RequestMethod.GET )
    public ResponseEntity<ResultResponse<List<PostResponse>>> getSavedPosts (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken
    ) {
        List<PostResponse> postResponses = postService.getSavedPosts(jwtToken);

        return ResponseEntity.ok(ResultResponse.<List<PostResponse>>builder()
                .body(postResponses)
                .timeStamp(LocalDateTime.now().toString())
                .message("Saved posts fetched successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }

    @RequestMapping( value="/delete_post/{id}" ,method = RequestMethod.DELETE )
    public ResponseEntity<ResultResponse<Boolean>> deletePost (
            @RequestHeader( name = HttpHeaders.AUTHORIZATION, required = false ) String jwtToken,
            @PathVariable("id") String id
    ) {
        postService.deletePost(UUID.fromString(id), jwtToken);

        return ResponseEntity.ok(ResultResponse.<Boolean>builder()
                .body(true)
                .timeStamp(LocalDateTime.now().toString())
                .message("Post deleted successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build());
    }
}
