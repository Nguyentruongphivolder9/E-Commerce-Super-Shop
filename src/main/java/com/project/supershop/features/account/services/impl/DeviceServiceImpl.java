package com.project.supershop.features.account.services.impl;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Device;
import com.project.supershop.features.account.repositories.DeviceRepository;
import com.project.supershop.features.account.services.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Service
@Transactional
public class DeviceServiceImpl implements DeviceService {
    private final DeviceRepository deviceRepository;

    @Autowired
    public DeviceServiceImpl(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }


    @Override
    public Device saveDevice(Device device) {

        System.out.print(device);

        if (isDeviceEmpty(device)) {
            throw new IllegalArgumentException("Invalid device information");
        }

        Optional<Device> deviceOptional = deviceRepository.findDeviceByDeviceFingerPrint(device.getDeviceFingerPrint());

        return deviceOptional.orElseGet(() -> deviceRepository.save(device));
    }

    @Override
    public Device findDeviceByAccount(Account account) {
        return null;
    }

    private boolean isDeviceEmpty(Device device) {
        return (device.getCity() == null || device.getCity().isEmpty()) &&

                (device.getCountry() == null || device.getCountry().isEmpty()) &&

                (device.getDeviceFingerPrint() == null || device.getDeviceFingerPrint().isEmpty()) &&

                (device.getIpAddress() == null || device.getIpAddress().isEmpty()) &&

                (device.getLatitude() == null || device.getLatitude().isEmpty()) &&

                (device.getLongitude() == null || device.getLongitude().isEmpty()) &&

                (device.getRegion() == null || device.getRegion().isEmpty()) &&

                (device.getRegionName() == null || device.getRegionName().isEmpty()) &&

                (device.getBrowserName() == null || device.getBrowserName().isEmpty()) &&

                (device.getDeviceType() == null || device.getDeviceType().isEmpty());
    }
}
