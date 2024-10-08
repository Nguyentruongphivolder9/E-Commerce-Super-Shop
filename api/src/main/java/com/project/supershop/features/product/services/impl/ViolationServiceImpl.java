package com.project.supershop.features.product.services.impl;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.product.domain.dto.requests.ProductViolationRequest;
import com.project.supershop.features.product.domain.dto.requests.TypeViolationRequest;
import com.project.supershop.features.product.domain.dto.responses.HistoryViolationResponse;
import com.project.supershop.features.product.domain.dto.responses.ProductResponse;
import com.project.supershop.features.product.domain.dto.responses.ProductViolationResponse;
import com.project.supershop.features.product.domain.dto.responses.TypeViolationResponse;
import com.project.supershop.features.product.domain.entities.HistoryViolation;
import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.product.domain.entities.TypeViolation;
import com.project.supershop.features.product.repositories.HistoryViolationRepository;
import com.project.supershop.features.product.repositories.ProductRepository;
import com.project.supershop.features.product.repositories.TypeViolationRepository;
import com.project.supershop.features.product.services.ViolationService;
import com.project.supershop.features.product.utils.ProductUtils;
import com.project.supershop.features.product.utils.enums.StatusProduct;
import com.project.supershop.handler.NotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ViolationServiceImpl implements ViolationService {
    private final HistoryViolationRepository historyViolationRepository;
    private final ProductRepository productRepository;
    private final TypeViolationRepository typeViolationRepository;
    private final ModelMapper modelMapper;
    private final JwtTokenService jwtTokenService;

    public ViolationServiceImpl(HistoryViolationRepository historyViolationRepository, ProductRepository productRepository, TypeViolationRepository typeViolationRepository, ModelMapper modelMapper, JwtTokenService jwtTokenService) {
        this.historyViolationRepository = historyViolationRepository;
        this.productRepository = productRepository;
        this.typeViolationRepository = typeViolationRepository;
        this.modelMapper = modelMapper;
        this.jwtTokenService = jwtTokenService;
    }

    @Override
    public List<HistoryViolationResponse> createViolationReportProduct(ProductViolationRequest formRequest) {
        Optional<TypeViolation> typeViolationOptional = typeViolationRepository.findById(UUID.fromString(formRequest.getTypeViolationId()));

        if(typeViolationOptional.isEmpty()){
            throw new NotFoundException("Type violation not found in the database.");
        }

        List<HistoryViolation> violationList = new ArrayList<>();
        for (String productId : formRequest.getProductId()) {
            Optional<Product> productOptional = productRepository.findById(UUID.fromString(productId));
            if(productOptional.isEmpty()){
                throw new NotFoundException("Products not found in the database.");
            }

            if(!Objects.equals(StatusProduct.PENDING_APPROVAL.getValue(), productOptional.get().getStatus())
                    && !Objects.equals(StatusProduct.FOR_SALE.getValue(), productOptional.get().getStatus())) {
                throw new RuntimeException("The product has not been requested for sale or has been removed or is currently in violation that has not been processed by the seller.");
            }

            StatusProduct status = StatusProduct.fromValue(formRequest.getStatus());
            Product product = productOptional.get();
            HistoryViolation violation = HistoryViolation.createHistoryViolation(formRequest, product, typeViolationOptional.get());
            product.setStatus(status.getValue());
            productRepository.save(product);
            violationList.add(violation);
        }

        List<HistoryViolation> result = historyViolationRepository.saveAll(violationList);
        return result.stream()
                .map(violation -> modelMapper.map(violation, HistoryViolationResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public TypeViolationResponse createTypeViolation(TypeViolationRequest formRequest) {
        Optional<TypeViolation> typeViolationOptional = typeViolationRepository.findByTitle(formRequest.getTitle());
        if(typeViolationOptional.isPresent()) {
            throw new NotFoundException(formRequest.getTitle() + " already existed.");
        }

        TypeViolation newTypeViolation = TypeViolation.createTypeViolation(formRequest.getTitle());
        TypeViolation typeViolation = typeViolationRepository.save(newTypeViolation);
        return modelMapper.map(typeViolation, TypeViolationResponse.class);
    }

    @Override
    public TypeViolationResponse updateTypeViolation(TypeViolationRequest formRequest) {
        Optional<TypeViolation> typeViolationOptional = typeViolationRepository.findByTitle(formRequest.getTitle());
        if(typeViolationOptional.isPresent()) {
            throw new NotFoundException(formRequest.getTitle() + " already existed.");
        }

        Optional<TypeViolation> typeViolationFindById = typeViolationRepository.findById(UUID.fromString(formRequest.getId()));
        if(typeViolationFindById.isEmpty()) {
            throw new NotFoundException(formRequest.getId() + " dose not exists.");
        }

        TypeViolation updateTypeViolation = typeViolationFindById.get();
        updateTypeViolation.setTitle(formRequest.getTitle());
        TypeViolation typeViolation = typeViolationRepository.save(updateTypeViolation);
        return modelMapper.map(typeViolation, TypeViolationResponse.class);
    }

    @Override
    public List<TypeViolationResponse> getAllTypeViolations() {
        List<TypeViolation> typeViolationResponses = typeViolationRepository.findAll();

        List<TypeViolationResponse> typeViolationResponseList = typeViolationResponses.stream()
                .map(violation -> modelMapper.map(violation, TypeViolationResponse.class))
                .collect(Collectors.toList());

        for (TypeViolationResponse violationResponse : typeViolationResponseList) {
            int countViolation = historyViolationRepository.countByTypeViolationId(UUID.fromString(violationResponse.getId()));
            violationResponse.setCountViolation(countViolation);
        }

        return typeViolationResponseList;
    }

    @Override
    public void deleteListTypeOfViolation(List<String> typeOfViolationIds) {
        System.out.println(typeOfViolationIds);
        List<TypeViolation> forbiddenKeywordList = new ArrayList<>();
        for (String id : typeOfViolationIds){
            Optional<TypeViolation> updateKeywordOptional = typeViolationRepository.findById(UUID.fromString(id));
            forbiddenKeywordList.add(updateKeywordOptional.get());
        }

        typeViolationRepository.deleteAll(forbiddenKeywordList);
    }

    @Override
    public List<HistoryViolationResponse> getAllHistoryViolationOfProduct(String productId) {
        List<HistoryViolation> historyViolations = historyViolationRepository.findByProductId(UUID.fromString(productId));

        return historyViolations.stream()
                .map(violation -> modelMapper.map(violation, HistoryViolationResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAndRevocationOfViolations(String productId) {
        Optional<Product> productOptional = productRepository.findById(UUID.fromString(productId));

        if(productOptional.isEmpty()){
            throw new NotFoundException("Products not found in the database.");
        }

        Optional<HistoryViolation> historyViolations = historyViolationRepository.findByProductIdAndIsRepaired(UUID.fromString(productId), false);
        if(historyViolations.isPresent()) {
            Product product = productOptional.get();
            product.setStatus(historyViolations.get().getPrevStatus());
            productRepository.save(product);
            historyViolationRepository.delete(historyViolations.get());
        }
    }

    @Override
    public Page<ProductViolationResponse> getListProductsViolation(QueryParameters queryParameters, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        int page = queryParameters.getPage() != null ? Integer.parseInt(queryParameters.getPage()) - 1 : 0;
        int limit = queryParameters.getLimit() != null ? Integer.parseInt(queryParameters.getLimit()) : 20;
        String searchValue = queryParameters.getSearch() != null ? queryParameters.getSearch() : null;
        Pageable sortedPageable = PageRequest.of(page, limit);

        Page<HistoryViolation> productPage = historyViolationRepository.findProductViolation(
                sortedPageable,
                parseJwtToAccount.getId(),
                searchValue
        );

        modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
        });
        return productPage.map(result -> modelMapper.map(result, ProductViolationResponse.class));
    }
}
