package com.project.supershop.features.rating.controllers;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.rating.domain.dto.requests.RatingRequest;
import com.project.supershop.features.rating.domain.dto.requests.SellerFeedbackRequest;
import com.project.supershop.features.rating.domain.dto.responses.PaginationRatingForUserResponse;
import com.project.supershop.features.rating.domain.dto.responses.RatingFigureResponse;
import com.project.supershop.features.rating.domain.dto.responses.RatingForUserResponse;
import com.project.supershop.features.rating.domain.dto.responses.RatingResponse;
import com.project.supershop.features.rating.services.RatingService;
import com.project.supershop.features.rating.services.SellerFeedbackService;
import com.project.supershop.features.rating.services.VoteUseFullService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/ratings")
public class RatingController {
    private final RatingService ratingService;
    private final SellerFeedbackService sellerFeedbackService;
    private final VoteUseFullService voteUseFullService;

    public RatingController(RatingService ratingService, SellerFeedbackService sellerFeedbackService, VoteUseFullService voteUseFullService) {
        this.ratingService = ratingService;
        this.sellerFeedbackService = sellerFeedbackService;
        this.voteUseFullService = voteUseFullService;
    }

//    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<ResultResponse<String>> createRating(
//            @RequestParam("productIds") List<String> productIds,
//            @RequestParam("orderItemIds") List<String> orderItemIds,
//            @RequestParam("ratingStars") List<String> ratingStars,
//            @RequestParam("productQualities") List<String> productQualities,
//            @RequestParam("trueDescriptions") List<String> trueDescriptions,
//            @RequestParam("comments") List<String> comments,
//            @RequestParam("ratingFiles") MultipartFile[] ratingFiles,
//            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) throws IOException {
//
//        List<RatingRequest> ratings = new ArrayList<>();
//        for (int i = 0; i < orderItemIds.size(); i++) {
//            int finalI = i;
//            RatingRequest rating = new RatingRequest();
//            rating.setProductId(productIds.stream()
//                    .filter(string -> {
//                        String[] parts = string.split("_rating_");
//                        return parts.length > 1 && Integer.parseInt(parts[1]) == finalI;
//                    })
//                    .findFirst()
//                    .orElseThrow(() -> new UnprocessableException("productId must not be blank")));
//            rating.setOrderItemId(orderItemIds.stream()
//                    .filter(string -> {
//                        String[] parts = string.split("_rating_");
//                        return parts.length > 1 && Integer.parseInt(parts[1]) == finalI;
//                    })
//                    .findFirst()
//                    .orElseThrow(() -> new UnprocessableException("orderItemId must not be blank")));
//
//            rating.setRatingStar(Integer.parseInt(ratingStars.stream()
//                    .filter(string -> {
//                        String[] parts = string.split("_rating_");
//                        return parts.length > 1 && Integer.parseInt(parts[1]) == finalI;
//                    })
//                    .findFirst()
//                    .orElseThrow(() -> new UnprocessableException("ratingStar must not be blank"))));
//            rating.setProductQuality(productQualities.stream()
//                    .filter(string -> {
//                        String[] parts = string.split("_rating_");
//                        return parts.length > 1 && Integer.parseInt(parts[1]) == finalI;
//                    })
//                    .findFirst().orElse(""));
//            rating.setTrueDescription(trueDescriptions.stream()
//                    .filter(string -> {
//                        String[] parts = string.split("_rating_");
//                        return parts.length > 1 && Integer.parseInt(parts[1]) == finalI;
//                    })
//                    .findFirst().orElse(""));
//            rating.setComment(comments.stream()
//                    .filter(string -> {
//                        String[] parts = string.split("_rating_");
//                        return parts.length > 1 && Integer.parseInt(parts[1]) == finalI;
//                    })
//                    .findFirst().orElse(""));
//
//
//            MultipartFile[] imageFilesArray = Arrays.stream(ratingFiles)
//                    .filter(file -> {
//                        String[] parts = Objects.requireNonNull(file.getOriginalFilename()).split("_rating_");
//                        if (parts.length > 1) {
//                            try {
//                                return Integer.parseInt(parts[1]) == finalI;
//                            } catch (NumberFormatException e) {
//                                return false;
//                            }
//                        }
//                        return false;
//                    })
//                    .toArray(MultipartFile[]::new);
//
//            rating.setImageFiles(imageFilesArray);
//            ratings.add(rating);
//        }
//
//        ratingService.createRatings(ratings, jwtToken);
//
//        return ResponseEntity.created(URI.create("")).body(
//                ResultResponse.<String>builder()
//                        .body("Reviews for a successful product.")
//                        .timeStamp(LocalDateTime.now().toString())
//                        .message("Reviews for a successful product.")
//                        .statusCode(HttpStatus.CREATED.value())
//                        .build()
//        );
//    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ResultResponse<String>> createRating(
            @Valid @ModelAttribute RatingRequest request,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) throws IOException {
        ratingService.createRatings(request, jwtToken);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<String>builder()
                        .body("Reviews for a successful product.")
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Reviews for a successful product.")
                        .statusCode(HttpStatus.CREATED.value())
                        .build());
    }

    @PostMapping(
            value = "/seller-feedback",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResultResponse<String>> createSellerFeedback(
            @Valid @RequestBody SellerFeedbackRequest request,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) {
        sellerFeedbackService.createSellerFeedback(request, jwtToken);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<String>builder()
                        .body("Respond to successful product reviews.")
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Respond to successful product reviews.")
                        .statusCode(HttpStatus.CREATED.value())
                        .build());
    }

    @PostMapping("/{id}/vote-use-full")
    public ResponseEntity<ResultResponse<String>> voteUseFull(
            @PathVariable("id") String id,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        voteUseFullService.toggleLikeRating(id, jwtToken);
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<String>builder()
                        .body("successfully")
                        .timeStamp(LocalDateTime.now().toString())
                        .message("successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @GetMapping("/product/{productId}/figure")
    public ResponseEntity<ResultResponse<RatingFigureResponse>> getRatingFigure(
            @PathVariable("productId") String productId,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        RatingFigureResponse result = ratingService.getRatingFigureForUser(productId, jwtToken);
        ResultResponse<RatingFigureResponse> response = ResultResponse.<RatingFigureResponse>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ResultResponse<PaginationRatingForUserResponse>> getListRatings(
            @PathVariable("productId") String productId,
            @ModelAttribute QueryParameters queryParameters,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        PaginationRatingForUserResponse result = ratingService.getListRatingsForUser(queryParameters, productId, jwtToken);
        ResultResponse<PaginationRatingForUserResponse> response = ResultResponse.<PaginationRatingForUserResponse>builder()
                .body(result)
                .timeStamp(LocalDateTime.now().toString())
                .message("Get List successfully")
                .statusCode(HttpStatus.OK.value())
                .status(HttpStatus.OK)
                .build();

        return ResponseEntity.ok(response);
    }

}
