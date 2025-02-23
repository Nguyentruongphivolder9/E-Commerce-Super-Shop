package com.project.supershop.features.account.controller;

import com.project.supershop.common.ResultResponse;
import com.project.supershop.features.account.domain.dto.request.DeviceIdListRequest;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.AccountDevice;
import com.project.supershop.features.account.domain.entities.Device;
import com.project.supershop.features.account.repositories.AccountDeviceRepository;
import com.project.supershop.features.account.repositories.AccountRepositories;
import com.project.supershop.features.account.repositories.DeviceRepository;
import com.project.supershop.features.auth.domain.entities.AccessToken;
import com.project.supershop.features.auth.providers.SecretKeyProvider;
import com.project.supershop.features.auth.repositories.AccessTokenRepository;
import com.project.supershop.features.auth.services.AccessTokenService;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.twilio.http.Response;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/v1/accountTesting")
public class AccountTestController {
    private final AccessTokenService accessTokenService;
    private final AccountRepositories accountRepositories;
    private final SecretKeyProvider secretKeyProvider;
    private final JwtTokenService jwtTokenService;
    private final DeviceRepository deviceRepository;
    private final AccessTokenRepository accessTokenRepository;
    private final AccountDeviceRepository accountDeviceRepository;

    public AccountTestController(
            AccessTokenService accessTokenService,
            AccountDeviceRepository accountDeviceRepository,
            DeviceRepository deviceRepository,
            AccountRepositories accountRepositories,
            SecretKeyProvider secretKeyProvider,
            JwtTokenService jwtTokenService,
            AccessTokenRepository accessTokenRepository
    ) {
        this.accessTokenService = accessTokenService;
        this.accountDeviceRepository = accountDeviceRepository;
        this.accountRepositories = accountRepositories;
        this.secretKeyProvider = secretKeyProvider;
        this.jwtTokenService = jwtTokenService;
        this.deviceRepository = deviceRepository;
        this.accessTokenRepository = accessTokenRepository;
    }

    @GetMapping("/get-all-account")
    public ResponseEntity<ResultResponse<?>> getAllAccount() {
        List<Account> accounts = accountRepositories.findAll();
        int count = 0;
        for (Account account : accounts) {
            count++;
//            System.out.print("Số lượng device trong account thứ " + count + " là :" + account.getDevices().size());
        }

        return ResponseEntity.ok(
                ResultResponse.<List<Account>>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(accounts)
                        .message("Accounts fetched successfully")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }


    @GetMapping("/get-all-device")
    public ResponseEntity<ResultResponse<?>> getAllDevice() {
        return ResponseEntity.ok(
                ResultResponse.<List<Device>>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(deviceRepository.findAll())
                        .message("Account is now offline")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }


    @PostMapping("/add-account")
    public ResponseEntity<ResultResponse<?>> addAccoount(@RequestBody Account account) {
        return ResponseEntity.ok(
                ResultResponse.<Account>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(accountRepositories.save(account))
                        .message("Add thanh cong")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @PostMapping("/add-device")
    public ResponseEntity<ResultResponse<?>> addDevice(@RequestBody Device device) {
        return ResponseEntity.ok(
                ResultResponse.<Device>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(deviceRepository.save(device))
                        .message("Add thanh cong")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }


    @PostMapping(value = "/assignDevicesToAccount/{accountId}")
    public ResponseEntity<ResultResponse<?>> assignDevicesToAccount(
            @PathVariable(name = "accountId") UUID accountId,
            @RequestBody DeviceIdListRequest deviceIds) {

        // Tìm tài khoản
        Account account = accountRepositories.findById(accountId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found")
        );

        // Lấy danh sách thiết bị đã được gán cho tài khoản
        Set<Device> devicesByAccountID = accountRepositories.findDevicesByAccountId(account.getId());

        // Duyệt qua danh sách thiết bị cần gán
        for (UUID deviceId : deviceIds.getDeviceIds()) {
            // Tìm thiết bị
            Device device = deviceRepository.findById(deviceId).orElseThrow(
                    () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Device not found with ID: " + deviceId)
            );

            // Kiểm tra xem thiết bị đã được gán cho tài khoản chưa
            if (devicesByAccountID.contains(device)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "The account already contains the device.");
            }

            // Tạo đối tượng AccountDevice và thiết lập giá trị
            AccountDevice accountDevice = new AccountDevice();
            accountDevice.setAccount(account);
            accountDevice.setDevice(device);
            accountDevice.setPrimary(false);
            accountDevice.setHide(false);

            // Lưu AccountDevice vào cơ sở dữ liệu
            accountDeviceRepository.save(accountDevice);
        }

        // Lưu lại tài khoản để cập nhật trạng thái
        accountRepositories.save(account);

        return ResponseEntity.ok(
                ResultResponse.<Account>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(account)
                        .message("Devices assigned successfully.")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @GetMapping("/{deviceId}/accounts")
    public ResponseEntity<Set<Account>> getAccountByDevice(
            @PathVariable UUID deviceId
    ) {
        Set<Account> accounts = deviceRepository.findAccountsByDeviceId(deviceId);
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/get-all-accessToken")
    public ResponseEntity<ResultResponse<List<AccessToken>>> getAllAccessToken() {
        return ResponseEntity.ok(
                ResultResponse.<List<AccessToken>>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(accessTokenRepository.findAll())
                        .message("Get all accessToken successfully")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @PostMapping("/add-accessToken")
    public ResponseEntity<AccessToken> addAccessToken(@RequestBody AccessToken accessToken) {
        AccessToken savedToken = accessTokenRepository.save(accessToken);
        return new ResponseEntity<>(savedToken, HttpStatus.CREATED);
    }

    @GetMapping("/get-devices-by-account/{accountId}/devices")
    public ResponseEntity<Set<Device>> getDevicesByAccount(@PathVariable UUID accountId) {
        Set<Device> devices = accountRepositories.findDevicesByAccountId(accountId);
        return ResponseEntity.ok(devices);
    }

    @GetMapping("/get-devices-by-accessToken/{accessTokenId}/devices")
    public ResponseEntity<ResultResponse<?>> getAllDevicesByAccessToken(
            @PathVariable UUID accessTokenId
    ) {
        return ResponseEntity.ok(
                ResultResponse.<Set<Device>>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(accessTokenRepository.findDevicesByAccessTokenId(accessTokenId))
                        .message("Account is now offline")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

//    @PostMapping("/{deviceId}/accessToken")
//    public ResponseEntity<ResultResponse<?>> assignDeviceToAccessToken(
//            @PathVariable UUID accessTokenId,
//            @RequestBody DeviceIdListRequest deviceIds
//    ) {
//
//    }

    @GetMapping("/get-accessTokne-by-account-and-device/{accountId}/{deviceId}")
    public ResponseEntity<ResultResponse<?>> getAllAccessTokenByAccountId(
            @PathVariable UUID accountId,
            @PathVariable UUID deviceId
    ) {
        System.out.print("AccessToken: " + accessTokenRepository.findAccessTokenByDeviceIdAndAccountId(deviceId, accountId));
        return ResponseEntity.ok(

                ResultResponse.<AccessToken>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(accessTokenRepository.findAccessTokenByDeviceIdAndAccountId(deviceId, accountId))
                        .message("Account is now offline")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @DeleteMapping("/delete-accessToken-by-id/{accessTokenId}")
    public ResponseEntity<ResultResponse<?>> deleteAccessTokenById(
            @PathVariable UUID accessTokenId
    ) {
        Optional<AccessToken> accessTokenOptional = accessTokenRepository.findById(accessTokenId);

        if (accessTokenOptional.isPresent()) {
            accessTokenService.deleteAccessTokenAndRelatedData(accessTokenId);
            return ResponseEntity.ok(
                    ResultResponse.<List<AccessToken>>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(accessTokenRepository.findAll())
                            .message("Delete successFully")
                            .status(HttpStatus.OK)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } else {
            throw new EntityNotFoundException("AccessToken not found with id: " + accessTokenId);
        }
    }

    @GetMapping("/get-all-devices-by-accountId/{accountId}")
    public ResponseEntity<ResultResponse<?>> getAllDevicesByAccountId(
            @PathVariable UUID accountId
    ) {
        AccessToken accessTokenFromDb = accessTokenRepository.findAccessTokenByAccountId(accountId);
        if (accessTokenFromDb == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResultResponse.<Set<Device>>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(null)
                            .message("AccessToken not found with accountId: " + accountId)
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .build()
            );
        }

        List<Device> deviceList = new ArrayList<>(accessTokenFromDb.getDevices());

        return ResponseEntity.ok(
                ResultResponse.<List<Device>>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(deviceList)
                        .message("Successfully retrieved devices")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }

    @PostMapping("/assign-device-to-accessToken/{deviceId}/{accessTokenId}")
    public ResponseEntity<ResultResponse<?>> assignDeviceToAccessToken(
            @PathVariable UUID deviceId,
            @PathVariable UUID accessTokenId
    ) {
        try {
            Device device = deviceRepository.findById(deviceId)
                    .orElseThrow(() -> new EntityNotFoundException("Device not found with id : " + deviceId));

            AccessToken accessToken = accessTokenRepository.findById(accessTokenId)
                    .orElseThrow(() -> new EntityNotFoundException("AccessToken not found with Id : " + accessTokenId));

            device.setAccessToken(accessToken);
            deviceRepository.save(device);

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("deviceId", device.getId());
            responseBody.put("accessTokenId", accessToken.getId());
            responseBody.put("status", "associated");

            return ResponseEntity.ok(
                    ResultResponse.builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(responseBody)
                            .message("Successfully assigned device to AccessToken")
                            .status(HttpStatus.OK)
                            .statusCode(HttpStatus.OK.value())
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ResultResponse.<Void>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(null)
                            .message("Failed to assign device to AccessToken : " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
                    );
        }
    }

    @GetMapping("/get-accessToken-by-accountId/{accountId}")
    public ResponseEntity<ResultResponse<?>> getAccessTokenByAccountId(
            @PathVariable UUID accountId
    ) {
        AccessToken accessTokenFromDb = accessTokenRepository.findAccessTokenByAccountId(accountId);
        if (accessTokenFromDb == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResultResponse.<AccessToken>builder()
                            .timeStamp(LocalDateTime.now().toString())
                            .body(null)
                            .message("AccessToken not found with accountId: " + accountId)
                            .status(HttpStatus.NOT_FOUND)
                            .statusCode(HttpStatus.NOT_FOUND.value())
                            .build()
            );
        }

        return ResponseEntity.ok(
                ResultResponse.<AccessToken>builder()
                        .timeStamp(LocalDateTime.now().toString())
                        .body(accessTokenFromDb)
                        .message("Successfully retrieved AccessToken")
                        .status(HttpStatus.OK)
                        .statusCode(HttpStatus.OK.value())
                        .build()
        );
    }


}
