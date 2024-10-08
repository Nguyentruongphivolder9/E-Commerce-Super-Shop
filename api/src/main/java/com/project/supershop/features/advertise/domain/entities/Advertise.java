package com.project.supershop.features.advertise.domain.entities;

import com.project.supershop.common.BaseEntity;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.advertise.domain.dto.request.AdvertiseRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Advertise")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Data
public class Advertise extends BaseEntity {
    private String title;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long esBanner;

    private int click;

    private Long costBanner;
    private String paymentMethod;

    private String status;

    private boolean payed;
    private boolean run;
    private boolean isDeleted;

    @ManyToOne
    @JoinColumn(name = "shopId")
    private Account account;


    @OneToMany(mappedBy = "advertise", fetch = FetchType.LAZY)
    private List<AdvertiseImage> advertiseImages ;  // Initialize the list

    public static Advertise createAdvertise(AdvertiseRequest advertiseRequest, Account account) {
        return Advertise.builder()
                .title(advertiseRequest.getTitle())
                .startDate(advertiseRequest.getStartDate())
                .endDate(advertiseRequest.getEndDate())
                .esBanner(advertiseRequest.getEsBanner())
                .costBanner(advertiseRequest.getCostBanner())
                .status(advertiseRequest.getStatus())
                .account(account)
                .payed(false) // Assuming payment status is false by default
                .run(false)   // Assuming the advertisement is not running by default
                .isDeleted(false) // Assuming it's not deleted by default
                .build();
    }


    public void markAsPaid() {
        this.payed = true;
        this.status = "Wait Accept"; // Update status to "Wait Accept" after payment
    }

    public void markAsPendingPayment() {
        this.payed = false;
        this.status = "Pending Payment";
        this.run = false;
    }


}
