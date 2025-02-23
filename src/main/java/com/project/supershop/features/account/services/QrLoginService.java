package com.project.supershop.features.account.services;

import com.project.supershop.features.account.domain.entities.QrLogin;

public interface QrLoginService {
    QrLogin getQrLoginByToken(String token);
}
