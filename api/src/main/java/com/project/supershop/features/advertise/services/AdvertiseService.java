package com.project.supershop.features.advertise.services;

import com.project.supershop.features.advertise.domain.dto.request.AdvertiseRequest;
import com.project.supershop.features.advertise.domain.dto.response.AdsPaymentRespone;
import com.project.supershop.features.advertise.domain.dto.response.AdvertiseReponse;
import com.project.supershop.features.advertise.domain.dto.response.BannerRespone;
import com.project.supershop.features.advertise.domain.entities.Advertise;
import com.stripe.exception.StripeException;


import java.io.IOException;
import java.util.List;
import java.util.UUID;


public interface AdvertiseService {

    AdsPaymentRespone createAdvertise(AdvertiseRequest advertiseRequest, String jwtToken) throws IOException, StripeException;
    AdsPaymentRespone retryPayment(UUID advertiseId, String paymentMethod) throws IOException, StripeException ;

    Advertise updatePaymentStatus(UUID adsId, String status, boolean payed);
    AdvertiseReponse  getAdvertiseById(UUID id) ;
    List<AdvertiseReponse> getAllAdvertises();

    List<AdvertiseReponse> getAllAdvertisesOfShop(String jwtToken);

    Advertise updateAdvertiseStatusAdmin(UUID adsId);
    List<BannerRespone> getActiveAdvertiseImages() ;

    List<AdvertiseReponse> filterAdvertises(Integer month, Integer year, String status, Boolean payed, Boolean run);

    void deleteUnpaidAdvertises();
    void updateActiveImage();
    List<AdvertiseReponse> getDeletedAdvertises();
    void incrementClick(UUID advertiseId);

    List<AdvertiseReponse> filterAdvertisesOfShop(String jwtToken, Integer month, Integer year, String status, Boolean payed, Boolean run);

    List<AdvertiseReponse> getDeletedAdvertisesShop(String jwtToken);



}
