package com.project.supershop.features.advertise.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class ScheduledAdvertiseService {

    @Autowired
    private AdvertiseService advertiseService;

    @Scheduled(fixedRate = 20000) // Run every 20 seconds
    public void scheduledDeleteUnpaidAdvertises() {
        advertiseService.deleteUnpaidAdvertises();
    }

    @Scheduled(fixedRate = 20000) // Run every 20 seconds
    public void scheduledgetActiveAdvertiseImages() {
        advertiseService.updateActiveImage();
    }
}