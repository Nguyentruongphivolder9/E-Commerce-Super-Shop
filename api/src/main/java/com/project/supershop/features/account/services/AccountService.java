package com.project.supershop.features.account.services;

import com.project.supershop.features.account.domain.dto.request.AccountRequest;
import com.project.supershop.features.account.domain.dto.request.AccountUpdateRequest;
import com.project.supershop.features.account.domain.dto.request.MergeAccountGoogleRequest;
import com.project.supershop.features.account.domain.dto.request.WaitingForEmailVerifyRequest;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Device;
import com.project.supershop.features.account.repositories.AccountRepositories;
import com.project.supershop.features.auth.domain.dto.request.RegisterRequest;
import com.project.supershop.features.auth.domain.dto.response.EmailVerficationResponse;
import com.project.supershop.features.auth.domain.dto.response.JwtResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountService {
    List<Account> getAllAccounts();

    Account saveAccount(Account account);

    Account convertToAccount(UserDetails userDetails);

    //Finding interfaces
    Account findByEmail(String email);

    UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;

    //Email verify token interfaces
    EmailVerficationResponse verifyToken(String token);

    String processNewEmailVerification(String emailTo);

    void logoutAccount(String email, String token, String deviceFingerPrint);

    JwtResponse login(Object principal, Device deviceInfo);

    boolean waitingForEmailResponse(WaitingForEmailVerifyRequest waitingForEmailVerifyRequest);

    Account createAccountFromGoogleAccount(Account accountFromGoogle);

    Account createAccountFromFaceBookAccount(Account accountFromGoogle);

    Account registerAccount(RegisterRequest registerRequest);

    String encodeAccountPassword(String password);

    String decodeAccountPassword(String password);

    JwtResponse refreshToken(String refreshToken);

    Account checkLocalAccount(String email);

    Account mergeAccountFromGoogleToLocalAccount(MergeAccountGoogleRequest mergeAccountGoogleRequest);

    JwtResponse updateAccount(AccountUpdateRequest accountUpdateRequest, String Token, Device device);

    Account assignDeviceToAccount(Account account, Device deviceInfo, boolean isPrimary);

    List<Account> getAllAccountByDeviceFingerPrint(String deviceFingerPrint);

    void hidePreviousAccount(String email, String deviceFingerPrint);

    void currentlyOffine(String email);

    void curretlyOnline(String email);

    void processNewLoginVerfication(String emailTo,Device device);

    Account findAccountById(UUID id);
}
