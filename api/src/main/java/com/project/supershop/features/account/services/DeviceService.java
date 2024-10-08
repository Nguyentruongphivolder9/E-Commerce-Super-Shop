package com.project.supershop.features.account.services;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Device;

public interface DeviceService {
    Device saveDevice(Device device);
    Device findDeviceByAccount(Account account);
}
