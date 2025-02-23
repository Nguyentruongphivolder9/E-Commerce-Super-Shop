package com.project.supershop.features.advertise.services.implement;

import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.repositories.AccountRepositories;
import com.project.supershop.features.advertise.domain.dto.request.AdvertiseRequest;
import com.project.supershop.features.advertise.domain.dto.response.AdsPaymentRespone;
import com.project.supershop.features.advertise.domain.dto.response.AdvertiseImageResponse;
import com.project.supershop.features.advertise.domain.dto.response.AdvertiseReponse;
import com.project.supershop.features.advertise.domain.dto.response.BannerRespone;
import com.project.supershop.features.advertise.domain.entities.Advertise;
import com.project.supershop.features.advertise.domain.entities.AdvertiseImage;
import com.project.supershop.features.advertise.repository.AdvertiseImageRepository;
import com.project.supershop.features.advertise.repository.AdvertiseRepository;
import com.project.supershop.features.advertise.services.AdsPaymentService;
import com.project.supershop.features.advertise.services.AdvertiseService;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.handler.UnprocessableException;
import com.project.supershop.services.FileUploadUtils;
import com.stripe.exception.StripeException;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdvertiseServiceImpl implements AdvertiseService {
    private final AdvertiseRepository advertiseRepository;
    private final AccountRepositories accountRepositories;
    private final AdvertiseImageRepository advertiseImageRepository;
    private final AdsPaymentService adsPaymentService;
    private final FileUploadUtils fileUploadUtils;
    private final ModelMapper modelMapper;
    private final JwtTokenService jwtTokenService;

    public AdvertiseServiceImpl(AdvertiseRepository advertiseRepository, AccountRepositories accountRepositories, AdvertiseImageRepository advertiseImageRepository, AdsPaymentService adsPaymentService, FileUploadUtils fileUploadUtils, ModelMapper modelMapper, JwtTokenService jwtTokenService) {
        this.advertiseRepository = advertiseRepository;
        this.accountRepositories = accountRepositories;
        this.advertiseImageRepository = advertiseImageRepository;
        this.adsPaymentService = adsPaymentService;
        this.fileUploadUtils = fileUploadUtils;
        this.modelMapper = modelMapper;
        this.jwtTokenService = jwtTokenService;
    }

    @Override
    public AdsPaymentRespone createAdvertise(AdvertiseRequest advertiseRequest, String jwtToken) throws IOException, StripeException {
        // Extract shopId from the JWT token
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        UUID shopIdFromToken = parseJwtToAccount.getId();

        // Set the shopId from JWT token if it's not provided in the request
        if (advertiseRequest.getShopId() == null) {
            advertiseRequest.setShopId(shopIdFromToken);
        }

        // Validate request fields
        if (advertiseRequest.getStartDate() == null || advertiseRequest.getEndDate() == null) {
            throw new UnprocessableException("StartDate and EndDate cannot be null");
        }

        if (advertiseRequest.getStartDate().isBefore(LocalDateTime.now())) {
            throw new UnprocessableException("StartDate cannot be in the past");
        }

        if (advertiseRequest.getEndDate().isBefore(advertiseRequest.getStartDate())) {
            throw new UnprocessableException("EndDate must be after StartDate");
        }

        // Ensure the date range is within reasonable limits (e.g., not more than 1 year apart)
        if (ChronoUnit.DAYS.between(advertiseRequest.getStartDate(), advertiseRequest.getEndDate()) > 365) {
            throw new UnprocessableException("The date range cannot be more than one year");
        }

        if (advertiseRequest.getTitle() == null || advertiseRequest.getTitle().length() < 5 || advertiseRequest.getTitle().length() > 100) {
            throw new UnprocessableException("Title cannot be null and must be between 5 and 100 characters long");
        }

        if (advertiseRequest.getImageFiles() == null || advertiseRequest.getImageFiles().length == 0) {
            throw new UnprocessableException("At least one image file must be provided");
        }

        // Validate image files
        for (MultipartFile imageFile : advertiseRequest.getImageFiles()) {
            if (!imageFile.getContentType().startsWith("image/")) {
                throw new UnprocessableException("Invalid file type: " + imageFile.getOriginalFilename());
            }

            if (imageFile.getSize() > 5 * 1024 * 1024) { // 5MB limit
                throw new UnprocessableException("File size exceeds limit (5MB): " + imageFile.getOriginalFilename());
            }
        }

        if (advertiseRequest.getEsBanner() < 10) {
            throw new UnprocessableException("Bidding Banner must be greater than 30000");
        }

        // Retrieve related entities based on request data
        Account account = accountRepositories.findById(advertiseRequest.getShopId())
                .orElseThrow(() -> new UnprocessableException("Shop with ID " + advertiseRequest.getShopId() + " not found"));


        // Use startDate as LocalDateTime from the request
        LocalDateTime startDateTime = advertiseRequest.getStartDate();

        int adsCount = advertiseRepository.countAcceptedAdsByDayAndWithinRange(startDateTime);

        if (adsCount >= 3) {
            throw new UnprocessableException("There are already 3 ads in this time period. No more ads can be created.");
        }



        // Check for overlapping advertisements
        List<Advertise> overlappingAds = advertiseRepository.findOverlappingAdvertisements(advertiseRequest.getShopId(),
                advertiseRequest.getStartDate(),
                advertiseRequest.getEndDate());
        if (!overlappingAds.isEmpty()) {
            throw new UnprocessableException("The new advertisement's date range overlaps with an existing advertisement.");
        }

        // Create a new Advertise entity
        Advertise advertise = Advertise.createAdvertise(advertiseRequest, account);

        // Save the Advertise entity
        Advertise savedAdvertise = advertiseRepository.save(advertise);

        // Process and save new images
        List<AdvertiseImage> advertiseImages = saveImages(advertiseRequest.getImageFiles(), savedAdvertise);
        savedAdvertise.setAdvertiseImages(advertiseImages);

        // Save the updated Advertise entity with images
        savedAdvertise = advertiseRepository.save(savedAdvertise);

        // Process payment
        Long totalAmountAdvertise = advertise.getCostBanner();
        AdsPaymentRespone adsPaymentRespone = processPayment(advertiseRequest.getPaymentMethod(), totalAmountAdvertise, advertise);

        // If payment is successful, mark the advertisement as paid
        if (paymentSuccessful(adsPaymentRespone)) {
            advertise.markAsPaid();
            advertiseRepository.save(advertise);
        } else {
            advertise.markAsPendingPayment();
            advertiseRepository.save(advertise);
        }

        return adsPaymentRespone;
    }


    private boolean paymentSuccessful(AdsPaymentRespone adsPaymentRespone) {
        // Assuming you have a statusCode field, where '00' indicates success
        return adsPaymentRespone != null && "00".equals(adsPaymentRespone.getStatusCode());
    }

    @Override
    public Advertise updatePaymentStatus(UUID adsId, String status, boolean payed) {
        // Find the advertisement by id
        Advertise advertisement = advertiseRepository.findById(adsId)
                .orElseThrow(() -> new UnprocessableException("Advertisement not found"));

        // Update the payment status
        advertisement.setStatus(status);
        advertisement.setPayed(payed);

        // Save the updated advertisement
        advertiseRepository.save(advertisement);


        return advertisement;

    }

    private AdvertiseReponse mapAdvertiseToResponse(Advertise advertise) {
        AdvertiseReponse response = modelMapper.map(advertise, AdvertiseReponse.class);
        return response;
    }

    @Override
    public List<AdvertiseReponse> getAllAdvertises() {
        List<Advertise> advertises = advertiseRepository.findAll();
        return advertises.stream()
                .map(this::mapAdvertiseToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AdvertiseReponse getAdvertiseById(UUID id) {
        Optional<Advertise> optionalAdvertise = advertiseRepository.findById(id);
        if (optionalAdvertise.isPresent()) {
            Advertise advertise = optionalAdvertise.get();
            return modelMapper.map(advertise, AdvertiseReponse.class);
        } else {
            throw new UnprocessableException("Advertise not found with id: " + id);
        }
    }


    @Override
    public Advertise updateAdvertiseStatusAdmin(UUID adsId) {
        // Find the advertisement by id
        Advertise advertise = advertiseRepository.findById(adsId)
                .orElseThrow(() -> new UnprocessableException("Advertisement not found"));

        // Check if the status is "Wait Accept" and update it to "Accepted"
        if ("Wait Accept".equals(advertise.getStatus()) && advertise.isPayed() == true) {
            advertise.setStatus("Accepted");
        } else {
            throw new UnprocessableException("This advertise must be pay before update status Accepted");
        }
        // Save the updated advertisement entity
        advertiseRepository.save(advertise);

        return advertise;
    }

    public List<BannerRespone> getActiveAdvertiseImages() {
        LocalDateTime now = LocalDateTime.now();
        List<Advertise> activeAdvertises = advertiseRepository.findActiveAdvertises(now);
        // Convert to BannerRespone
        return activeAdvertises.stream()
                .map(advertise1 -> {
                    List<AdvertiseImageResponse> imageResponses = advertise1.getAdvertiseImages().stream()
                            .map(img -> new AdvertiseImageResponse(img.getId(), img.getImageUrl())) // Map AdvertiseImage to AdvertiseImageResponse
                            .collect(Collectors.toList());

                    return new BannerRespone(advertise1.getId(), advertise1.getAccount().getId(), imageResponses);
                })
                .collect(Collectors.toList());
    }


    private AdsPaymentRespone processPayment(String paymentMethod, Long totalAmount, Advertise advertise) throws StripeException, IOException {
        AdsPaymentRespone adsPaymentRespone;

        switch (paymentMethod) {
            case "STRIPE":
                adsPaymentRespone = adsPaymentService.createPaymentStripe(totalAmount, advertise);
                break;
            case "VNPAY":
                adsPaymentRespone = adsPaymentService.createPaymentUrlVnPay(totalAmount, advertise);
                break;
            default:
                throw new UnprocessableException("Unsupported payment method");
        }

        return adsPaymentRespone;
    }


    private List<AdvertiseImage> saveImages(MultipartFile[] imageFiles, Advertise advertise) throws IOException {
        List<AdvertiseImage> advertiseImages = new ArrayList<>();
        for (MultipartFile imageFile : imageFiles) {
            String fileName = fileUploadUtils.uploadFile(imageFile, "advertises");

            AdvertiseImage advertiseImage = AdvertiseImage.createAdvertiseImage(fileName, advertise);
            advertiseImages.add(advertiseImage);
        }
        return advertiseImageRepository.saveAll(advertiseImages);
    }

    public List<AdvertiseReponse> getAllAdvertisesOfShop(String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        UUID shopId = parseJwtToAccount.getId(); // Implement this method to extract shopId from JWT token
        List<Advertise> advertises = advertiseRepository.findAllByShopId(shopId);
        return advertises.stream()
                .map(this::convertToAdvertiseResponse)
                .collect(Collectors.toList());
    }

    private AdvertiseReponse convertToAdvertiseResponse(Advertise advertise) {
        AdvertiseReponse response = modelMapper.map(advertise, AdvertiseReponse.class);
        return response;
    }

    public List<AdvertiseReponse> filterAdvertises(Integer month, Integer year, String status, Boolean payed, Boolean run) {
        // Fetch the list of Advertise entities from the repository
        List<Advertise> advertises = advertiseRepository.findNonDeleteAdvertises();

        // Filter the entities based on the criteria
        return advertises.stream()
                .filter(ad -> {
                    if (month != null && year != null) {
                        LocalDateTime startDate = ad.getStartDate();
                        return startDate.getMonthValue() == month && startDate.getYear() == year;
                    }
                    return true;
                })
                // Filter by status if provided
                .filter(ad -> status == null || ad.getStatus().equalsIgnoreCase(status))
                // Filter by payed status if provided
                .filter(ad -> payed == null || ad.isPayed() == payed)
                // Filter by run status if provided
                .filter(ad -> run == null || ad.isRun() == run)
                // Map Advertise to AdvertiseResponse
                .map(this::convertToAdvertiseResponse)
                .collect(Collectors.toList());
    }

    // Method to filter advertisements for a shop based on JWT token and filters
    public List<AdvertiseReponse> filterAdvertisesOfShop(String jwtToken, Integer month, Integer year, String status, Boolean payed, Boolean run) {
        // Extract shopId from JWT token
        Account account = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        UUID shopId = account.getId();

        // Fetch all advertisements for the shop
        List<Advertise> shopAdvertises = advertiseRepository.findAllByShopId(shopId);

        // Apply the filtering logic
        return shopAdvertises.stream()
                .filter(ad -> {
                    boolean matchesMonthYear = true;
                    if (month != null && year != null) {
                        LocalDateTime startDate = ad.getStartDate();
                        matchesMonthYear = startDate.getMonthValue() == month && startDate.getYear() == year;
                    }
                    return matchesMonthYear;
                })
                // Filter by status if it's provided
                .filter(ad -> status == null || ad.getStatus().equalsIgnoreCase(status))
                // Filter by payed status if it's provided
                .filter(ad -> payed == null || ad.isPayed() == payed)
                // Filter by run status if it's provided
                .filter(ad -> run == null || ad.isRun() == run)
                // Map Advertise to AdvertiseResponse
                .map(this::convertToAdvertiseResponse)
                .collect(Collectors.toList());
    }

    public void deleteUnpaidAdvertises() {
        // Calculate the time limit (current time minus 5 minutes)
        LocalDateTime timeLimit = LocalDateTime.now().minusMinutes(5);

        // Find unpaid adverts that were created before the time limit
        List<Advertise> unpaidAdvertises = advertiseRepository.findUnpaidAdvertisesBefore(timeLimit);

        // Mark them as deleted
        unpaidAdvertises.forEach(ad -> ad.setDeleted(true));

        // Save changes
        advertiseRepository.saveAll(unpaidAdvertises);
    }

    @Override
    public void updateActiveImage() {
        LocalDateTime now = LocalDateTime.now();
        List<Advertise> activeAdvertises = advertiseRepository.findAll();

        // Iterate over the activeAdvertises and update the 'run' status
        for (Advertise advertise : activeAdvertises) {
            boolean shouldRun = now.isAfter(advertise.getStartDate())
                    && now.isBefore(advertise.getEndDate())
                    && advertise.isPayed()
                    && "Accepted".equals(advertise.getStatus());

            boolean shouldComplete = now.isEqual(advertise.getEndDate()) ||
                    (now.isAfter(advertise.getEndDate())
                            && advertise.isPayed()
                            && "Running".equals(advertise.getStatus()));

            if (shouldRun) {
                advertise.setStatus("Running");
                advertise.setRun(true);  // Set run to true if conditions are met
            }
            if (shouldComplete) {
                advertise.setStatus("Complete");
                advertise.setRun(false);  // Set run to false if should be completed
            }
        }

        // Save the updated advertisements after iterating through all of them
        advertiseRepository.saveAll(activeAdvertises);
    }

    public List<AdvertiseReponse> getDeletedAdvertises() {
        // Fetch the deleted advertisements from the repository
        List<Advertise> deletedAdvertises = advertiseRepository.findDeletedAdvertises();
        return deletedAdvertises.stream()
                .map(this::convertToAdvertiseResponse)
                .collect(Collectors.toList());
    }

    public void incrementClick(UUID advertiseId) {
        advertiseRepository.incrementClick(advertiseId);
    }

    @Override
    public List<AdvertiseReponse> getDeletedAdvertisesShop(String jwtToken) {
        // Extract shopId from JWT token
        Account account = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        UUID shopId = account.getId();

        List<Advertise> deletedAdvertises = advertiseRepository.findAllDeletedAdvertiseByShopId(shopId);

        return deletedAdvertises.stream()
                .map(this::convertToAdvertiseResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AdsPaymentRespone retryPayment(UUID advertiseId, String paymentMethod) throws IOException, StripeException {
        // Retrieve the advertisement by ID
        Advertise advertise = advertiseRepository.findById(advertiseId)
                .orElseThrow(() -> new UnprocessableException("Advertisement not found"));

        // Ensure the advertisement is in a state where payment can be retried
        if (advertise.isPayed() || !"Pending Payment".equals(advertise.getStatus()) || advertise.isDeleted() || advertise.isRun()) {
            throw new UnprocessableException("Payment cannot be retried for this advertisement.");
        }

        // Process payment
        Long totalAmountAdvertise = advertise.getCostBanner();
        AdsPaymentRespone adsPaymentRespone = processPayment(paymentMethod, totalAmountAdvertise, advertise);

        // If payment is successful, mark the advertisement as paid
        if (paymentSuccessful(adsPaymentRespone)) {
            advertise.markAsPaid();
            advertiseRepository.save(advertise);
        }
        else {
            advertise.markAsPendingPayment();
            advertiseRepository.save(advertise);
        }
        return adsPaymentRespone;
    }




}
