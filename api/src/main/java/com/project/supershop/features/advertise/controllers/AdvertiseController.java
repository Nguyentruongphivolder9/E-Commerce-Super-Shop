package com.project.supershop.features.advertise.controllers;

import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.advertise.domain.dto.request.AdvertisePaymentRequest;
import com.project.supershop.features.advertise.domain.dto.request.AdvertiseRequest;
import com.project.supershop.features.advertise.domain.dto.response.AdsPaymentRespone;
import com.project.supershop.features.advertise.domain.dto.response.AdvertiseReponse;

import com.project.supershop.features.advertise.domain.dto.response.BannerRespone;
import com.project.supershop.features.advertise.domain.entities.Advertise;
import com.project.supershop.features.advertise.services.AdvertiseService;
import com.project.supershop.handler.UnprocessableException;
import com.stripe.exception.StripeException;
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
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/advertises")
public class AdvertiseController {

    private AdvertiseService advertiseService ;

    public AdvertiseController(AdvertiseService advertiseService) {
        this.advertiseService = advertiseService;
    }

    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ResultResponse<AdsPaymentRespone>> create(
            @Valid @ModelAttribute AdvertiseRequest advertiseRequest,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) throws IOException {
        try {
            // Step 1: Create the advertisement and initiate payment process
            AdsPaymentRespone adsPaymentRespone = advertiseService.createAdvertise(advertiseRequest, jwtToken);

            // Step 2: Return the payment URL and other details to the client
            return ResponseEntity.created(URI.create("")).body(
                    ResultResponse.<AdsPaymentRespone>builder()
                            .body(adsPaymentRespone)
                            .timeStamp(LocalDateTime.now().toString())
                            .message("Advertisement created successfully. Please proceed with payment.")
                            .statusCode(HttpStatus.CREATED.value())
                            .build());
        } catch (UnprocessableException e) {
            // Handle validation or business logic errors
            return ResponseEntity.badRequest().body(
                    ResultResponse.<AdsPaymentRespone>builder()
                            .body(null)
                            .timeStamp(LocalDateTime.now().toString())
                            .message(e.getMessage())
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build());
        } catch (IOException e) {
            // Handle file processing errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResultResponse.<AdsPaymentRespone>builder()
                            .body(null)
                            .timeStamp(LocalDateTime.now().toString())
                            .message("File processing error: " + e.getMessage())
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());
        } catch (Exception e) {
            // Handle any other unexpected errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResultResponse.<AdsPaymentRespone>builder()
                            .body(null)
                            .timeStamp(LocalDateTime.now().toString())
                            .message("An unexpected error occurred: " + e.getMessage())
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build());
        }
    }

    @PutMapping("/payed")
    public ResponseEntity<ResultResponse<Advertise>> updatePaymentStatus(
            @RequestBody AdvertisePaymentRequest paymentRequest) {

        Advertise response = advertiseService.updatePaymentStatus(paymentRequest.getAdsId(), paymentRequest.getStatus(), paymentRequest.isPayed());
        return ResponseEntity.created(URI.create("")).body(
                ResultResponse.<Advertise>builder()
                        .body(response)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Advertisement payed successfully")
                        .statusCode(HttpStatus.CREATED.value())
                        .build());
    }

    @PutMapping("/status/update/{advertiseId}")
    public ResponseEntity<ResultResponse<Advertise>> updateAdvertiseStatusAdmin(
            @PathVariable UUID advertiseId) {
        Advertise response = advertiseService.updateAdvertiseStatusAdmin(advertiseId);
        return ResponseEntity.ok(
                ResultResponse.<Advertise>builder()
                        .body(response)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Advertisement status updated successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResultResponse<AdvertiseReponse>> getAdvertiseById(@PathVariable UUID id) {
        AdvertiseReponse advertise = advertiseService.getAdvertiseById(id);

        if (advertise == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ResultResponse.<AdvertiseReponse>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .message("Advertisement not found")
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .build());
        }

        return ResponseEntity.ok(
                ResultResponse.<AdvertiseReponse>builder()
                        .body(advertise)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Get Detail Advertise successfully!")
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }


    @GetMapping
    public ResponseEntity<ResultResponse<List<AdvertiseReponse>>> getAllAdvertises(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean payed,
            @RequestParam(required = false) Boolean run) {
        List<AdvertiseReponse> filteredAdvertises = advertiseService.filterAdvertises(month, year, status, payed, run);
        return ResponseEntity.ok(
                ResultResponse.<List<AdvertiseReponse>>builder()
                        .body(filteredAdvertises)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("List of all advertises fetched successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @GetMapping("/active-images")
    public ResponseEntity<ResultResponse<List<BannerRespone>>> getActiveAdvertiseImages() {
        try {
            List<BannerRespone> bannerResponses = advertiseService.getActiveAdvertiseImages();
            return ResponseEntity.ok(
                    ResultResponse.<List<BannerRespone>>builder()
                            .body(bannerResponses)
                            .timeStamp(LocalDateTime.now().toString())
                            .message("Fetched active advertise images successfully")
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } catch (UnprocessableException e) {
            // Handle validation or business logic errors
            return ResponseEntity.badRequest().body(
                    ResultResponse.<List<BannerRespone>>builder()
                            .body(null)
                            .timeStamp(LocalDateTime.now().toString())
                            .message(e.getMessage())
                            .statusCode(HttpStatus.BAD_REQUEST.value())
                            .build()
            );
        }
    }


    @GetMapping("/shop")
    public ResponseEntity<ResultResponse<List<AdvertiseReponse>>> getAllAdvertisesOfShop(
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean payed,
            @RequestParam(required = false) Boolean run
            ) {

        // Delegate to the service to filter adverts based on the shop's token and additional filters
        List<AdvertiseReponse> filteredAdvertises = advertiseService.filterAdvertisesOfShop(jwtToken, month, year, status, payed, run);

        return ResponseEntity.ok(
                ResultResponse.<List<AdvertiseReponse>>builder()
                        .body(filteredAdvertises)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("List of shop's advertisements fetched successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }


    @PostMapping("/delete-unpaid")
    public ResponseEntity<String> deleteUnpaidAdvertises() {
        advertiseService.deleteUnpaidAdvertises();
        return ResponseEntity.ok("Unpaid advertisements older than 5 minutes have been deleted.");
    }

    @GetMapping("/admin/deleted")
    public ResponseEntity<ResultResponse<List<AdvertiseReponse>>> getDeletedAdvertises() {
        List<AdvertiseReponse> deletedAdvertises = advertiseService.getDeletedAdvertises();
        return ResponseEntity.ok(
                ResultResponse.<List<AdvertiseReponse>>builder()
                        .body(deletedAdvertises)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("List of all deleted advertises fetched successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @GetMapping("/shop/deleted")
    public ResponseEntity<ResultResponse<List<AdvertiseReponse>>> getDeletedAdvertisesShop(
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken
    ) {
        List<AdvertiseReponse> deletedAdvertises = advertiseService.getDeletedAdvertisesShop(jwtToken);

        return ResponseEntity.ok(
                ResultResponse.<List<AdvertiseReponse>>builder()
                        .body(deletedAdvertises)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("List of all deleted advertises shop fetched successfully")
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @PutMapping("/increment-click/{id}")
    public ResponseEntity<?> incrementClick(@PathVariable UUID id) {
        try {
            advertiseService.incrementClick(id);
            return ResponseEntity.ok().body("Click count incremented");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error incrementing click count");
        }
    }

    @PostMapping("/retry-payment/{advertiseId}")
    public ResponseEntity<ResultResponse<AdsPaymentRespone>> retryPayment (
            @PathVariable UUID advertiseId,
            @RequestParam String paymentMethod,
            @RequestHeader(name = HttpHeaders.AUTHORIZATION, required = false) String jwtToken) throws IOException, StripeException {

        AdsPaymentRespone adsPaymentRespone = advertiseService.retryPayment(advertiseId ,paymentMethod);
        return ResponseEntity.ok(
                ResultResponse.<AdsPaymentRespone>builder()
                        .body(adsPaymentRespone)
                        .timeStamp(LocalDateTime.now().toString())
                        .message("Please proceed with payment.")
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

}


