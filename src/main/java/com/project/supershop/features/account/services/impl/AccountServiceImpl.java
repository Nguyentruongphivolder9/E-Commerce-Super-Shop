package com.project.supershop.features.account.services.impl;

import com.project.supershop.features.account.domain.dto.request.AccountUpdateRequest;
import com.project.supershop.features.account.domain.dto.request.MergeAccountGoogleRequest;
import com.project.supershop.features.account.domain.dto.request.WaitingForEmailVerifyRequest;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.AccountDevice;
import com.project.supershop.features.account.domain.entities.Device;
import com.project.supershop.features.account.repositories.AccountDeviceRepository;
import com.project.supershop.features.account.repositories.AccountRepositories;
import com.project.supershop.features.account.repositories.DeviceRepository;
import com.project.supershop.features.account.services.AccountService;
import com.project.supershop.features.account.utils.enums.Provider;
import com.project.supershop.features.auth.domain.dto.request.RegisterRequest;
import com.project.supershop.features.auth.domain.dto.response.EmailVerficationResponse;
import com.project.supershop.features.auth.domain.dto.response.JwtResponse;
import com.project.supershop.features.auth.domain.entities.AccessToken;
import com.project.supershop.features.auth.providers.SecretKeyProvider;
import com.project.supershop.features.auth.services.AccessTokenService;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.auth.utils.AccessTokenUtils;
import com.project.supershop.features.email.domain.entities.Confirmation;
import com.project.supershop.features.email.domain.entities.Email;
import com.project.supershop.features.email.repositories.ConfirmationRepository;
import com.project.supershop.features.email.repositories.EmailRepository;
import com.project.supershop.features.email.sevices.EmailService;
import jakarta.persistence.Access;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.HashSet;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Transactional
public class AccountServiceImpl implements AccountService, UserDetailsService {

    private AccessTokenUtils accessTokenUtils;
    private final EmailService emailService;
    private final AccountRepositories accountRepositories;
    private final ConfirmationRepository confirmationRepository;
    private final EmailRepository emailRepository;
    private static final String FEMALE_DEFAULT_URL_AVATAR = "http://localhost:8080/api/v1/avatar/static/defaultAvatar/femaleAvatar/female.png";
    private static final String MALE_DEFAULT_URL_AVATAR = "http://localhost:8080/api/v1/avatar/static/defaultAvatar/maleAvatar/male.png";
    private final SecretKeyProvider secretKeyProvider;
    private JwtTokenService jwtTokenService;
    private AccessTokenService accessTokenService;
    private final DeviceRepository deviceRepository;
    private final AccountDeviceRepository accountDeviceRepository;

    @Autowired
    public AccountServiceImpl(
            AccessTokenUtils accessTokenUtils,
            DeviceRepository deviceRepository,
            SecretKeyProvider secretKeyProvider,
            AccountRepositories accountRepositories,
            ConfirmationRepository confirmationRepository,
            EmailService emailService,
            EmailRepository emailRepository,
            AccountDeviceRepository accountDeviceRepository
    ) {
        this.accessTokenUtils = accessTokenUtils;
        this.accountDeviceRepository = accountDeviceRepository;
        this.deviceRepository = deviceRepository;
        this.accountRepositories = accountRepositories;
        this.confirmationRepository = confirmationRepository;
        this.emailService = emailService;
        this.emailRepository = emailRepository;
        this.secretKeyProvider = secretKeyProvider;
    }

    @Autowired
    public void setJwtTokenService(JwtTokenService jwtTokenService) {
        this.jwtTokenService = jwtTokenService;
    }

    @Autowired
    public void setAccessTokenUtils(AccessTokenUtils accessTokenUtils) {
        this.accessTokenUtils = accessTokenUtils;
    }

    @Autowired
    public void setAccessTokenService(AccessTokenService accessTokenService) {
        this.accessTokenService = accessTokenService;
    }

    @Override
    public List<Account> getAllAccounts() {
        return accountRepositories.findAll();
    }

    @Override
    public Account findByEmail(String email) {
        return accountRepositories.findAccountByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Account not found with email: " + email));
    }

    @Override
    public String processNewEmailVerification(String emailTo) {
        Optional<Account> accountExists = accountRepositories.findAccountByEmail(emailTo);

        if (accountExists.isPresent() && accountExists.get().getIsEnable()) {
            throw new RuntimeException("Email is already verified for another account");
        }

        Email email = emailRepository.findEmailByEmailAddress(emailTo);
        if (email == null) {
            email = new Email();
            email.setEmailAddress(emailTo);
        }

        Confirmation emailConfirm = new Confirmation();
        emailConfirm.setEmail(email);

        confirmationRepository.save(emailConfirm);
        List<Confirmation> confirmationList = email.getConfirmations();
        if (confirmationList == null) {
            confirmationList = new ArrayList<>();
            email.setConfirmations(confirmationList);
        }
        confirmationList.add(emailConfirm);
        emailRepository.save(email);

        emailService.sendHtmlEmail("New User", emailTo, emailConfirm.getToken());
        return emailConfirm.getToken();
    }


    @Override
    public void logoutAccount(String email, String token, String deviceFingerPrint) {
        Account account = accountRepositories.findAccountByEmail(email)
                .orElseThrow(() -> new RuntimeException("Account not found for email: " + email));

        Device device = deviceRepository.findDeviceByDeviceFingerPrint(deviceFingerPrint)
                .orElseThrow(() -> new RuntimeException("Device not found"));

        AccessToken currentAccessToken = accessTokenService.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid Bearer Token"));

        Set<AccessToken> accessTokenSet = accountRepositories.findAccessTokensByAccountId(account.getId());

        account.setIsActive(false);
        account.setIsLoggedOut(true);
        accountRepositories.save(account);

        // Nếu chỉ có 1 token
        if (accessTokenSet.size() == 1) {
            accessTokenUtils.handleSingleAccessToken(accessTokenSet, device);
        } else {
            // Néu nhiều token
            accessTokenUtils.handleMultipleAccessTokens(currentAccessToken, accessTokenSet, device);
        }
    }


    @Override
    public JwtResponse login(Object principal, Device deviceInfo) {
        Account account = extractAccountFromPrincipal(principal);
        // Cập nhật trạng thái tài khoản
        updateAccountStatus(account);

        // Lấy tất cả AccessTokens liên quan đến tài khoản
        Set<AccessToken> accessTokens = accountRepositories.findAccessTokensByAccountId(account.getId());
        // Nếu không có AccessToken nào, tạo mới và lưu trữ

        if (accessTokens.isEmpty()) {
            return generateAndSaveJwtToken(account, deviceInfo);
        }

        AccessToken latestAccessToken = null;

        for (AccessToken accessToken : accessTokens) {
            AccessToken currentToken = accessToken;
            System.out.print("============> Logic here 1");
            while (currentToken.getNewAccessToken() != null) {
                if (currentToken.getDevices().contains(deviceInfo)) {
                    deviceInfo.setAccessToken(null);
                    deviceRepository.save(deviceInfo);
                }
                System.out.print("============> Logic here 2");

                currentToken = accessTokenService.findById(currentToken.getNewAccessToken());
            }

            if (!currentToken.getDevices().contains(deviceInfo)) {
                accessTokenService.addDeviceToAccessToken(deviceInfo.getId(), currentToken.getId());
            }

            latestAccessToken = currentToken;
        }
        System.out.print("============> Logic here 3");

        JwtResponse jwtResponse = new JwtResponse();

        jwtResponse.setAccessToken(latestAccessToken.getToken());
        jwtResponse.setRefreshToken(latestAccessToken.getRefreshToken());
        jwtResponse.setExpireRefreshToken(latestAccessToken.getExpiresIn());
        jwtResponse.setExpires(latestAccessToken.getExpiresAt());
        jwtResponse.setSecretKey(Arrays.toString(latestAccessToken.getSecretKey()));
        jwtResponse.setAccount(account);

        return jwtResponse;
    }


    private JwtResponse generateAndSaveJwtToken(Account account, Device device) {

        System.out.print("============> Logic Generate NEW TOKEN here");

        JwtResponse jwtResponse = jwtTokenService.createJwtResponse(account);

        AccessToken accessToken = AccessToken.builder()
                .token(jwtResponse.getAccessToken())
                .refreshToken(jwtResponse.getRefreshToken())
                .issuedAt(System.currentTimeMillis())
                .expiresAt(jwtResponse.getExpires())
                .secretKey(secretKeyProvider.getNewSecretKey().getEncoded())
                .account(account)
                .build();

        //Lưu device vào accessToken.

        accessToken.addDevice(device);

        accessTokenService.saveToken(accessToken);


        return jwtResponse;
    }


    @Override
    public boolean waitingForEmailResponse(WaitingForEmailVerifyRequest request) {
        Email email = emailRepository.findEmailByEmailAddress(request.getEmail());
        if (email.isVerified()) {
            return false;
        }
        if (email == null) {
            return false;
        }
        Confirmation confirmation = confirmationRepository.findConfirmationByEmailAndToken(email, request.getToken());
        return confirmation != null && confirmation.isVerify();
    }

    @Override
    public Account createAccountFromGoogleAccount(Account accountFromGoogle) {
        Optional<Account> optionalAccount = accountRepositories.findAccountByEmail(accountFromGoogle.getEmail());
        //Create
        if (optionalAccount.isEmpty()) {
            accountFromGoogle.setProvider(Provider.GOOGLE.getValue());
            accountFromGoogle.setIsLoggedOut(true);
            accountFromGoogle.setGender("male");
            return accountRepositories.save(accountFromGoogle);
        }
        return optionalAccount.get();
    }

    @Override
    public Account createAccountFromFaceBookAccount(Account accountFromGoogle) {
        Optional<Account> optionalAccount = accountRepositories.findAccountByEmail(accountFromGoogle.getEmail());
        //Create
        if (optionalAccount.isEmpty()) {
            accountFromGoogle.setProvider(Provider.FACEBOOK.getValue());
            accountFromGoogle.setIsLoggedOut(true);
            accountFromGoogle.setGender("male");
            return accountRepositories.save(accountFromGoogle);
        }
        return optionalAccount.get();
    }

    @Override
    public Account mergeAccountFromGoogleToLocalAccount(MergeAccountGoogleRequest mergeAccountGoogleRequest) {
        Optional<Account> optionalAccount = accountRepositories.findAccountByEmail(mergeAccountGoogleRequest.getEmail());

        // Merge
        if (optionalAccount.isPresent()) {
            Account localAccount = optionalAccount.get();

            if (mergeAccountGoogleRequest.getAvatar() == null && mergeAccountGoogleRequest.getUser_name() == null) {
                localAccount.setProvider(Provider.GOOGLE.getValue());
                localAccount.setIsMerege(false);
                return accountRepositories.save(localAccount);
            }

            if (mergeAccountGoogleRequest.getAvatar() != null) {
                localAccount.setAvatarUrl(mergeAccountGoogleRequest.getAvatar());
            }

            if (mergeAccountGoogleRequest.getUser_name() != null) {
                localAccount.setUserName(mergeAccountGoogleRequest.getUser_name());
            }

            return accountRepositories.save(localAccount);
        }

        return null;
    }

    @Override
    public JwtResponse updateAccount(AccountUpdateRequest accountUpdateRequest, String token, Device device) {
        // Tìm kiếm tài khoản theo email
        Optional<Account> accountExist = accountRepositories.findAccountByEmail(accountUpdateRequest.getEmail());
        if (accountExist.isPresent()) {
            Account account = accountExist.get();
            if (accountUpdateRequest.getFull_name() != null) {
                if (account.getUserFullNameChanges() == 0) {
                    throw new RuntimeException("Out of name change attempts");
                } else {
                    account.setUserFullNameChanges(account.getUserFullNameChanges() - 1);
                    account.setFullName(accountUpdateRequest.getFull_name());
                }
            }
            if (accountUpdateRequest.getPhone_number() != null) {
                account.setPhoneNumber(accountUpdateRequest.getPhone_number());
            }
            if (accountUpdateRequest.getGender() != null) {
                account.setGender(accountUpdateRequest.getGender());
            }
            if (accountUpdateRequest.getBirth_day() != null) {
                account.setBirthDay(accountUpdateRequest.getBirth_day());
            }

            Optional<AccessToken> accessTokenOptional = accessTokenService.findByToken(token);
            if (accessTokenOptional.isPresent()) {
                AccessToken currentAccessToken = accessTokenOptional.get();

                while (currentAccessToken.getNewAccessToken() != null) {
                    //Gắt tất cả các quan hệ với accessToken nếu chỉ còn 1 thiết bị kết nối với nó.
                    if (currentAccessToken.getDevices().contains(device) && currentAccessToken.getDevices().size() == 1) {

                        device.setAccessToken(null);

                        deviceRepository.save(device);

                        currentAccessToken.setAccount(null);

                        accessTokenService.saveToken(currentAccessToken);

                        accessTokenService.deleteAccessToken(currentAccessToken.getId());
                    }
                    if (currentAccessToken.getDevices().contains(device)) {
                        device.setAccessToken(null);
                        deviceRepository.save(device);
                    }
                    currentAccessToken = accessTokenService.findById(currentAccessToken.getNewAccessToken());
                }
                JwtResponse jwtResponse = jwtTokenService.createJwtResponse(account);

                AccessToken accessToken = AccessToken.builder()
                        .token(jwtResponse.getAccessToken())
                        .refreshToken(jwtResponse.getRefreshToken())
                        .issuedAt(System.currentTimeMillis())
                        .expiresAt(jwtResponse.getExpires())
                        .secretKey(secretKeyProvider.getNewSecretKey().getEncoded())
                        .build();

                accessToken.setAccount(account);

                //Lưu device vào accessToken.

                accessToken.addDevice(device);

                currentAccessToken.setNewAccessToken(accessTokenService.saveToken(accessToken).getId());

                accessTokenService.saveToken(currentAccessToken);

                return jwtResponse;

            } else {
                throw new EntityNotFoundException("Invalid Bearer Token");
            }

        } else {
            throw new EntityNotFoundException("Account not found with email: " + accountUpdateRequest.getEmail());
        }
    }

    @Override
    public Account assignDeviceToAccount(Account account, Device device, boolean isPrimary) {

        device.setUpdatedAt(LocalDateTime.now());

        Set<Device> devices = accountRepositories.findDevicesByAccountId(account.getId());

        for (Device d : devices) {
            if (device.equals(d)) {
                return account;
            }
        }

        AccountDevice accountDevice = new AccountDevice();
        accountDevice.setAccount(account);
        accountDevice.setDevice(device);
        accountDevice.setPrimary(isPrimary);
        accountDevice.setHide(false);
        return accountDeviceRepository.save(accountDevice).getAccount();
    }


    @Override
    public List<Account> getAllAccountByDeviceFingerPrint(String deviceFingerPrint) {
        Optional<Device> device = deviceRepository.findDeviceByDeviceFingerPrint(deviceFingerPrint);
        // Nếu không tìm thấy device nào, trả về một danh sách trống
        if (device.isEmpty()) {
            return Collections.emptyList();
        }
        // Nếu tìm thấy device, sử dụng id của device đó để tìm Account
        Device deviceExist = device.get();
        return deviceRepository.findAccountByDeviceFingerPrint(deviceExist.getDeviceFingerPrint());
    }


    @Override
    public void hidePreviousAccount(String email, String deviceFingerPrint) {
        Account account = accountRepositories.findAccountByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with email: " + email));

        Device device = deviceRepository.findDeviceByDeviceFingerPrint(deviceFingerPrint)
                .orElseThrow(() -> new EntityNotFoundException("Invalid device information"));

//        account.removeDevice(device.getId());

        accountRepositories.save(account);
    }

    @Override
    public void currentlyOffine(String email) {
        Account account = accountRepositories.findAccountByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with email: " + email));
        account.setIsActive(false);
    }

    @Override
    public void curretlyOnline(String email) {
        Account account = accountRepositories.findAccountByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with email: " + email));
        account.setIsActive(true);
    }

    @Override
    public void processNewLoginVerfication(String emailTo, Device device) {

    }

    @Override
    public Account findAccountById(UUID id) {
        return accountRepositories.findById(id).orElseThrow(() -> new EntityNotFoundException("Account not found with id: " + id));
    }


    @Override
    public Account registerAccount(RegisterRequest request) {
        Email email = emailRepository.findEmailByEmailAddress(request.getEmail());
        if (email.isVerified()) {
            throw new RuntimeException("Email is already been verified for another account");
        }
        Optional<Account> accountWithEmailAbove = accountRepositories.findAccountByEmail(email.getEmailAddress());
        if (accountWithEmailAbove.isEmpty()) {
            throw new RuntimeException("No available registration account for the email");
        }

        request.setEnable(false);

        Account account = accountWithEmailAbove.get();

        account.setUserName(request.getUser_name());
        account.setFullName(request.getFull_name());
        account.setPassword(request.getPassword());
        account.setPhoneNumber(request.getPhone_number());
        account.setEmail(request.getEmail());
        account.setIsEnable(true);
        account.setGender(request.getGender());
        account.setAvatarUrl(request.getGender().equals("male") ? MALE_DEFAULT_URL_AVATAR : FEMALE_DEFAULT_URL_AVATAR);
        account.setBirthDay(parseStringToLocalDateTime(request.getBirth_day()));
        account.setProvider(Provider.LOCAL.getValue());
        account.setRoleName("USER");
        account.setIsActive(request.isActive());
        account.setIsLoggedOut(true);
        email.setVerified(true);
        emailRepository.save(email);

        return accountRepositories.save(account);

    }

    @Override
    public String encodeAccountPassword(String password) {
        return "";
    }

    @Override
    public String decodeAccountPassword(String password) {
        return "";
    }

    @Override
    public JwtResponse refreshToken(String refreshToken) {
        AccessToken accessToken = accessTokenService.findByRefreshToken(refreshToken);
        Account account = jwtTokenService.parseJwtTokenToAccount(accessToken.getToken());
        accessTokenService.deleteByToken(accessToken.getToken());
        JwtResponse response = jwtTokenService.createJwtResponse(account);
        AccessToken newAccessToken = AccessToken.builder()
                .token(response.getAccessToken())
                .refreshToken(response.getRefreshToken())
                .issuedAt(System.currentTimeMillis())
                .expiresAt(response.getExpires())
                .build();
        return response;
    }

    @Override
    public Account checkLocalAccount(String email) {
        Optional<Account> checkForAccount = accountRepositories.findAccountByEmail(email);
        if (checkForAccount.isPresent()) {
            Account account = checkForAccount.get();
            if (account.getProvider().equals(Provider.LOCAL.getValue())) {
                return account;
            }
        }
        return null;
    }


    @Override
    public Account saveAccount(Account account) {
        return null;
    }

    @Override
    public Account convertToAccount(UserDetails userDetails) {
        return accountRepositories.findAccountByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Account not found with email: " + userDetails.getUsername()));
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Account account = findByEmail(email);

        List<SimpleGrantedAuthority> authorities = Stream.of(account.getRoleName().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return new User(
                account.getEmail(),
                account.getPassword(),
                authorities
        );
    }

    private LocalDateTime parseStringToLocalDateTime(String dateString) {
        try {
            ZonedDateTime zonedDateTime = ZonedDateTime.parse(dateString);
            return zonedDateTime.toLocalDateTime();
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid birth_day format", e);
        }
    }

    @Override
    public EmailVerficationResponse verifyToken(String token) {
        EmailVerficationResponse response = new EmailVerficationResponse();
        Confirmation confirmation = confirmationRepository.findConfirmationByToken(token);

        if (confirmation == null) {
            response.setType("Not Found");
            response.setMessage("Confirmation token not found.");
            return response;
        }

        Email email = emailRepository.findEmailByConfirmations(confirmation);
        if (email == null) {
            response.setType("Not Found");
            response.setMessage("Email not found for confirmation token.");
            return response;
        }

        LocalDateTime expiredDay = confirmation.getCreatedAt().plusMinutes(5);
        if (expiredDay.isBefore(LocalDateTime.now())) {
            response.setType("Expired");
            response.setMessage("Confirmation token has expired.");
            return response;
        }

        if (!confirmation.isVerify()) {
            Account account = new Account();
            account.setEmail(email.getEmailAddress());
            account.setIsEnable(true);
            account.setIsActive(false);
            account.setIsLoggedOut(true);
            accountRepositories.save(account);

            confirmation.setVerify(true);
            confirmationRepository.save(confirmation);

            response.setType("Valid");
            response.setMessage("Email verification successful.");
            response.setEmail(account.getEmail());
        } else {
            response.setType("Valid");
            response.setMessage("Email is already verified.");
        }

        return response;
    }

    private Account extractAccountFromPrincipal(Object principal) {
        if (principal instanceof Account) {
            return (Account) principal;
        } else if (principal instanceof UserDetails) {
            return convertToAccount((UserDetails) principal);
        } else {
            throw new IllegalStateException("Unexpected principal type: " + principal.getClass());
        }
    }

    private void validateAccountStatus(Account account) {
        if (!account.getIsLoggedOut() && account.getIsActive()) {
            throw new RuntimeException("Account is already logged in and active currently");
        }
    }


    private void updateAccountStatus(Account account) {
        account.setIsActive(true);
        account.setIsLoggedOut(false);
        accountRepositories.save(account);
    }
}
