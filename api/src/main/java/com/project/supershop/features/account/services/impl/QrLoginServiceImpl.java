package com.project.supershop.features.account.services.impl;

import com.project.supershop.features.account.domain.entities.QrLogin;
import com.project.supershop.features.account.repositories.QrLoginRepo;
import com.project.supershop.features.account.services.QrLoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class QrLoginServiceImpl implements QrLoginService {
    private final QrLoginRepo qrLoginRepository;
    @Autowired
    public QrLoginServiceImpl(QrLoginRepo qrLoginRepository) {
        this.qrLoginRepository = qrLoginRepository;
    }
    @Override
    public QrLogin getQrLoginByToken(String token) {
       Optional<QrLogin> qrLogin = qrLoginRepository.findQrLoginByToken(token);
       return qrLogin.orElse(null);
    }
}
