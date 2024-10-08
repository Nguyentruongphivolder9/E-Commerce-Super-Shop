package com.project.supershop.features.product.services.impl;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.features.account.domain.dto.response.SellerInfoResponse;
import com.project.supershop.features.account.domain.entities.Account;
import com.project.supershop.features.account.domain.entities.Seller;
import com.project.supershop.features.account.repositories.SellerRepository;
import com.project.supershop.features.auth.services.JwtTokenService;
import com.project.supershop.features.product.domain.dto.requests.*;
import com.project.supershop.features.product.domain.dto.responses.*;
import com.project.supershop.features.product.domain.entities.*;
import com.project.supershop.features.product.repositories.*;
import com.project.supershop.features.product.services.ProductService;
import com.project.supershop.features.product.utils.ProductUtils;
import com.project.supershop.features.product.utils.enums.ConditionProduct;
import com.project.supershop.features.product.utils.enums.StatusProduct;
import com.project.supershop.handler.BadRequestException;
import com.project.supershop.handler.NotFoundException;
import com.project.supershop.handler.UnprocessableException;
import com.project.supershop.utils.ArrayUtils;
import com.project.supershop.utils.CheckTypeUUID;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {
    private final ModelMapper modelMapper;
    private final ProductRepository productRepository;
    private final VariantGroupRepository variantGroupRepository;
    private final VariantRepository variantRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final PreviewImageRepository previewImageRepository;
    private final CategoryRepository categoryRepository;
    private final JwtTokenService jwtTokenService;
    private final ProductFigureRepository productFigureRepository;
    private final TypeViolationRepository typeViolationRepository;
    private final SellerRepository sellerRepository;
    private final ProductFavoriteRepository productFavoriteRepository;
    private final HistoryViolationRepository historyViolationRepository;

    public ProductServiceImpl(ModelMapper modelMapper, ProductRepository productRepository, VariantGroupRepository variantGroupRepository, VariantRepository variantRepository, ProductVariantRepository productVariantRepository, ProductImageRepository productImageRepository, PreviewImageRepository previewImageRepository, CategoryRepository categoryRepository, JwtTokenService jwtTokenService, ProductFigureRepository productFigureRepository, TypeViolationRepository typeViolationRepository, SellerRepository sellerRepository, ProductFavoriteRepository productFavoriteRepository, HistoryViolationRepository historyViolationRepository) {
        this.modelMapper = modelMapper;
        this.productRepository = productRepository;
        this.variantGroupRepository = variantGroupRepository;
        this.variantRepository = variantRepository;
        this.productVariantRepository = productVariantRepository;
        this.productImageRepository = productImageRepository;
        this.previewImageRepository = previewImageRepository;
        this.categoryRepository = categoryRepository;
        this.jwtTokenService = jwtTokenService;
        this.productFigureRepository = productFigureRepository;
        this.typeViolationRepository = typeViolationRepository;
        this.sellerRepository = sellerRepository;
        this.productFavoriteRepository = productFavoriteRepository;
        this.historyViolationRepository = historyViolationRepository;
    }

    @Override
    public ProductResponse createProduct(ProductRequest productRequest, String jwtToken) {
        List<VariantGroup> variantGroups = new ArrayList<>();
        List<Variant> variants = new ArrayList<>();
        List<ProductVariant> productVariants = new ArrayList<>();
        List<ProductImage> productImages = new ArrayList<>();
        String status = StatusProduct.UNLISTED.value();

        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Optional<Seller> optionalSeller = sellerRepository.findByShopId(parseJwtToAccount.getId());
        Seller seller;
        if(optionalSeller.isEmpty()) {
            seller = Seller.createProductFigure(parseJwtToAccount);
        } else {
            Seller sellerData = optionalSeller.get();
            sellerData.setTotalProduct(sellerData.getTotalProduct() + 1);
            seller = sellerData;
        }
        sellerRepository.save(seller);
        checkCategory(productRequest.getCategoryId());

        if(productRequest.getIsActive()) {
            status = StatusProduct.PENDING_APPROVAL.getValue();
        }

        ConditionProduct conditionProduct = ConditionProduct.fromValue(productRequest.getConditionProduct().toLowerCase());
        productRequest.setConditionProduct(conditionProduct.getValue());

        Product product = Product.createProduct(productRequest, status, parseJwtToAccount);
        Product productResult = productRepository.save(product);
        ProductFigure productFigure = ProductFigure.createProductFigure(productResult);
        productFigureRepository.save(productFigure);

        if(productRequest.getProductImages().isEmpty() || productRequest.getProductImages().size() < 3 || productRequest.getProductImages().size() > 9){
            throw new UnprocessableException("The product image field must not be blank and contain 3 or more images and a maximum of 9 images.");
        }

        if(!productRequest.getIsVariant()) {
            if(productRequest.getPrice() == null || productRequest.getPrice() < 1000 || productRequest.getPrice() > 120000000){
                throw new UnprocessableException("The product price field cannot be empty and must be between 1,000 and 120,000,000.");
            }

            if(productRequest.getStockQuantity() == null || productRequest.getStockQuantity() <= 0 || productRequest.getStockQuantity() > 10000000){
                throw new UnprocessableException("The product stock field must be greater than 0 and less than 10,000,000.");
            }
        }

        if(productRequest.getStockQuantity() == null
                && productRequest.getPrice() == null
                && productRequest.getVariantsGroup().isEmpty()
                && productRequest.getProductVariants().isEmpty()
        ){
            throw new UnprocessableException("The product stock field can't be empty or less than 0.");
        }

        // thêm hình ảnh của product
        boolean isFirstImage = true;
        int countImage = 1;
        for (ProductImagesRequest imageRequest : productRequest.getProductImages()) {
            Optional<PreviewImage> productImage = previewImageRepository.findById(UUID.fromString(imageRequest.getId()));
            if(productImage.isEmpty()){
                throw new UnprocessableException("The product image field can't be empty.");
            }
            if (imageRequest.getImageUrl() == null) {
                throw new UnprocessableException("The product image field can't be empty.");
            }

            ProductImage resultProductImage = ProductImage.createProductImage(imageRequest.getImageUrl(), isFirstImage, productResult, countImage);

            isFirstImage = false;
            productImages.add(resultProductImage);
            previewImageRepository.deleteById(UUID.fromString(imageRequest.getId()));
            countImage++;
        }
        productImageRepository.saveAll(productImages);

        if(productRequest.getIsVariant()
                && productRequest.getStockQuantity() == null
                && productRequest.getPrice() == null
                && !productRequest.getVariantsGroup().isEmpty()
                && !productRequest.getProductVariants().isEmpty()
        ){
            if(productRequest.getVariantsGroup().size() > 2) {
                throw new UnprocessableException("Product variants contain up to 2 groups of variants.");
            }

            Set<String> variantGroupNames = new HashSet<>();
            Map<String, Set<String>> variantsGroupMap = new HashMap<>();
            int countGroupVariant = 1;
            for (VariantGroupRequest groupRequest : productRequest.getVariantsGroup()) { // kiểm tra xem field name của variantsGroup không được trùng nhau
                if (!variantGroupNames.add(groupRequest.getName())) {
                    throw new UnprocessableException(groupRequest.getName() + " is the same as the variation name of another variation");
                }

                if(groupRequest.getVariants().isEmpty() || groupRequest.getVariants().size() > 50) {
                    throw new UnprocessableException("In a group of variants containing only 1 to 50 variants.");
                }

                VariantGroup variantGroupBuild = VariantGroup.createVariantGroup(groupRequest, countGroupVariant, productResult);
                VariantGroup variantGroupResult = variantGroupRepository.save(variantGroupBuild);
                variantGroups.add(variantGroupResult);

                Set<String> variantNames = new HashSet<>();
                Set<String> variantIds = new HashSet<>();
                int countVariant = 1;
                for (VariantRequest variantRequest : groupRequest.getVariants()) {
                    if (!variantNames.add(variantRequest.getName())) { // kiểm tra xem các field name của variant không được trùng nhau
                        throw new UnprocessableException(variantRequest.getName() + " is the same as the variant name of another variant");
                    }

                    if (!groupRequest.getIsPrimary() && (variantRequest.getVariantImage().getImageUrl() != null)) { //kiểm tra isPrimary là true thì variant mới được chứa hình ảnh hoặc null
                        throw new UnprocessableException("IsPrimary field is true, then the new variant will contain an image or null");
                    }

                    if(variantRequest.getVariantImage().getId() != null) {
                        previewImageRepository.deleteById(UUID.fromString(variantRequest.getVariantImage().getId()));
                    }

                    Variant variant = Variant.createVariant(variantRequest.getName(), variantRequest.getVariantImage().getImageUrl(), countVariant, variantGroupResult);
                    Variant variantResult = variantRepository.save(variant);
                    variantIds.add(variantResult.getId().toString());

                    for(ProductVariantRequest productVariantRequest : productRequest.getProductVariants()){
                        if(productVariantRequest.getVariantsGroup1Id() != null
                                && productVariantRequest.getVariantsGroup1Id().equals(groupRequest.getId())
                                && productVariantRequest.getVariant1Id() != null
                                && productVariantRequest.getVariant1Id().equals(variantRequest.getId())){
                            productVariantRequest.setVariant1Id(variantResult.getId().toString());
                            productVariantRequest.setVariantsGroup1Id(variantGroupResult.getId().toString());
                        }
                        if(productVariantRequest.getVariantsGroup2Id() != null
                                && productVariantRequest.getVariantsGroup2Id().equals(groupRequest.getId())
                                && productVariantRequest.getVariant2Id() != null
                                && productVariantRequest.getVariant2Id().equals(variantRequest.getId())){
                            productVariantRequest.setVariant2Id(variantResult.getId().toString());
                            productVariantRequest.setVariantsGroup2Id(variantGroupResult.getId().toString());
                        }
                    }
                    variants.add(variantResult);
                    countVariant++;
                }
                variantsGroupMap.put(variantGroupResult.getId().toString(), variantIds);
                countGroupVariant++;
            }

            Set<String> variantPairs = new HashSet<>();
            Set<String> variantExistsOneVariantGroup = new HashSet<>();

            for (ProductVariantRequest variantRequest : productRequest.getProductVariants()) {
                String group1 = variantRequest.getVariantsGroup1Id();
                String group2 = variantRequest.getVariantsGroup2Id();

                // Kiểm tra variantsGroup1 phải tồn tại trong variantsGroupMap
                if (!variantsGroupMap.containsKey(group1)) {
                    throw new UnprocessableException("The variantsGroup1Id field named " + group1 + " must exist in variations.");
                }

                // Kiểm tra variant1Id phải tồn tại trong variantsGroup1
                if (!variantsGroupMap.get(group1).contains(variantRequest.getVariant1Id())) {
                    throw new UnprocessableException("The variant1Id field named " + variantRequest.getVariant1Id() + " must exist in variations " + group1);
                }

                // Kiểm tra giá sản phẩm không được null hoặc bé hơn 1000 và lớn hơn 120,000,000
                if (variantRequest.getPrice() == null || variantRequest.getPrice() < 1000 || variantRequest.getPrice() > 120000000) {
                    throw new UnprocessableException("The product price field cannot be empty and must be between 1,000 and 120,000,000.");
                }

                // Kiểm tra StockQuantity phải lớn hơn 0 và bé hơn 10,000,000
                if (variantRequest.getStockQuantity() == null || variantRequest.getStockQuantity() <= 0 || variantRequest.getStockQuantity() > 10000000) {
                    throw new UnprocessableException("The product stock field must be greater than 0 and less than 10,000,000.");
                }

                // Kiểm tra khi chỉ có một variantsGroup thì sẽ không có variantsGroup2 và variant2Id trong productVariant
                if (variantGroups.size() == 1 && variantRequest.getVariantsGroup2Id() == null && variantRequest.getVariant2Id() == null) {

                    // Kiểm tra chỉ có một variant1Id trong mỗi variantsGroup1
                    if (!variantExistsOneVariantGroup.add(variantRequest.getVariant1Id())) {
                        throw new UnprocessableException("Only one variant1Id is allowed in variantsGroup1");
                    }

                    // Tìm variant1 và thiết lập vào productVariantBuild
                    Variant variant1 = null;
                    for (Variant variant : variants) {
                        if (variant.getId().toString().equals(variantRequest.getVariant1Id())) {
                            variant1 = variant;
                            break;
                        }
                    }

                    // Lưu ProductVariant và thêm vào danh sách productVariants
                    ProductVariant productVariantBuild = ProductVariant.createProductVariant(variantRequest, productResult, variant1, null);
                    ProductVariant productVariant = productVariantRepository.save(productVariantBuild);
                    productVariants.add(productVariant);
                } else {
                    // Kiểm tra variantsGroup1 và variantsGroup2 không được giống nhau
                    if (group1.equals(group2)) {

                        throw new RuntimeException("variantsGroup1 and variantsGroup2 must be different");
                    }

                    // Kiểm tra variantsGroup1 và variantsGroup2 phải tồn tại trong variantsGroupMap
                    if (!variantsGroupMap.containsKey(group1) || !variantsGroupMap.containsKey(group2)) {
                        throw new UnprocessableException("variantsGroup1 " + group1 + " or variantsGroup2 " + group2 + " not found");
                    }

                    // Kiểm tra variant2Id phải tồn tại trong variantsGroup2
                    if (!variantsGroupMap.get(group2).contains(variantRequest.getVariant2Id())) {
                        throw new UnprocessableException("The variant1Id field named " + variantRequest.getVariant2Id() + " must exist in variations " + group2);
                    }

                    // Kiểm tra cặp variant1Id và variant2Id không được trùng nhau
                    String variantPair = variantRequest.getVariant1Id() + "-" + variantRequest.getVariant2Id();
                    if (!variantPairs.add(variantPair)) {
                        throw new UnprocessableException("Variant pair " + variantPair + " already exists");
                    }

                    // Tạo ProductVariant và thiết lập variant1 và variant2 vào đó
                    Variant variant1 = null;
                    Variant variant2 = null;
                    for (Variant variant : variants) {
                        if (variant.getId().toString().equals(variantRequest.getVariant1Id())) {
                            variant1 = variant;
                        }
                        if (variant.getId().toString().equals(variantRequest.getVariant2Id())) {
                            variant2 = variant;
                        }
                    }

                    // Lưu ProductVariant và thêm vào danh sách productVariants
                    ProductVariant productVariantBuild = ProductVariant.createProductVariant(variantRequest, productResult, variant1, variant2);
                    ProductVariant productVariant = productVariantRepository.save(productVariantBuild);
                    productVariants.add(productVariant);
                }
            }
        }

        if(!variantGroups.isEmpty()){
            for (VariantGroup variantGroup : variantGroups){
                List<Variant> variantList = new ArrayList<>();
                for (Variant variant : variants){
                    if(variantGroup.getId().equals(variant.getVariantGroup().getId())){
                        variantList.add(variant);
                    }
                }
                variantGroup.setVariants(variantList);
            }
        }

        productResult.setProductVariants(productVariants);
        productResult.setVariantsGroup(variantGroups);
        productResult.setProductImages(productImages);

        modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
        });
        modelMapper.map(productResult, ProductResponse.class);
/*
        String key = "product:" + productResponse.getId();
        redisJSON.set(key, SetArgs.Builder.create(".", GsonUtils.toJson(productResponse)));
*/
        return modelMapper.map(productResult, ProductResponse.class);
    }

    @Override
    public ProductResponse updateProduct(ProductRequest productRequest, String jwtToken) {
        List<VariantGroup> variantGroups = new ArrayList<>();
        List<Variant> variants = new ArrayList<>();
        List<ProductVariant> productVariants = new ArrayList<>();
        List<ProductImage> productImages = new ArrayList<>();
        boolean isUpdateStatus = false;

        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        // kiểm tra cate có tồn tại trong database không
        checkCategory(productRequest.getCategoryId());

        Optional<Product> productOptional = productRepository.findByProductIdOfProductOfShop(UUID.fromString(productRequest.getId()), UUID.fromString(productRequest.getShopId()));
        if(productOptional.isEmpty()){
            throw new NotFoundException("Product does not exists.");
        }

        if(!Objects.equals(productOptional.get().getName(), productRequest.getName())){
            isUpdateStatus = true;
            System.out.println("isUpdateStatus 1");
        }

        if (!Objects.equals(productOptional.get().getBrand(), productRequest.getBrand())){
            isUpdateStatus = true;
            System.out.println("isUpdateStatus 2");
        }

        if (!Objects.equals(productOptional.get().getDescription(), productRequest.getDescription())){
            isUpdateStatus = true;
            System.out.println("isUpdateStatus 2");
        }

        ConditionProduct conditionProduct = ConditionProduct.fromValue(productRequest.getConditionProduct().toLowerCase());

        productOptional.get().setShop(parseJwtToAccount);
        productOptional.get().setName(productRequest.getName());
        productOptional.get().setPrice(productRequest.getPrice());
        productOptional.get().setStockQuantity(productRequest.getStockQuantity());
        productOptional.get().setConditionProduct(conditionProduct.getValue());
        productOptional.get().setDescription(productRequest.getDescription());
        productOptional.get().setCategoryId(productRequest.getCategoryId());
        productOptional.get().setIsVariant(productRequest.getIsVariant());
        productOptional.get().setIsActive(productRequest.getIsActive());
        productOptional.get().setBrand(productRequest.getBrand());

        if(productRequest.getProductImages().isEmpty() || productRequest.getProductImages().size() < 3 || productRequest.getProductImages().size() > 9){
            throw new UnprocessableException("The product image field must not be blank and contain 3 or more images and a maximum of 9 images.");
        }

        if(!productRequest.getIsVariant()) {
            if(productRequest.getPrice() == null || productRequest.getPrice() < 1000 || productRequest.getPrice() > 120000000){
                throw new UnprocessableException("The product price field cannot be empty and must be between 1,000 and 120,000,000.");
            }

            if(productRequest.getStockQuantity() == null || productRequest.getStockQuantity() < 0 || productRequest.getStockQuantity() > 10000000){
                throw new UnprocessableException("The product stock field must be greater than 0 and less than 10,000,000.");
            }
        }

        if(productRequest.getStockQuantity() == null
                && productRequest.getPrice() == null
                && productRequest.getVariantsGroup().isEmpty()
                && productRequest.getProductVariants().isEmpty()
        ){
            throw new UnprocessableException("The product stock field can't be empty or less than 0.");
        }

        // thêm hình ảnh của product
        boolean isFirstImage = true;
        int countImage = 1;
        for (ProductImagesRequest imageRequest : productRequest.getProductImages()) {
            Optional<ProductImage> productImageOptional = productImageRepository.findById(UUID.fromString(imageRequest.getId()));
            ProductImage productImage;

            if (productImageOptional.isEmpty()) {
                isUpdateStatus = true;
                System.out.println("isUpdateStatus 4");
                Optional<PreviewImage> productPreviewImage = previewImageRepository.findById(UUID.fromString(imageRequest.getId()));
                if (productPreviewImage.isEmpty() || imageRequest.getImageUrl() == null) {
                    throw new UnprocessableException("The product image field can't be empty.");
                }

                productImage = ProductImage.createProductImage(imageRequest.getImageUrl(), isFirstImage, productOptional.get(), countImage);
                previewImageRepository.deleteById(UUID.fromString(imageRequest.getId()));
            } else {
                productImage = productImageOptional.get();
                productImage.setImageUrl(imageRequest.getImageUrl());
                productImage.setIsPrimary(isFirstImage);
                productImage.setProduct(productOptional.get());
                productImage.setSortOrder(countImage);
            }

            productImages.add(productImage);
            isFirstImage = false;
            countImage++;
        }
        productImageRepository.saveAll(productImages);

        if(productRequest.getIsVariant()
                && productRequest.getStockQuantity() == null
                && productRequest.getPrice() == null
                && !productRequest.getVariantsGroup().isEmpty()
                && !productRequest.getProductVariants().isEmpty()
        ){
            if(productRequest.getVariantsGroup().size() > 2) {
                throw new UnprocessableException("Product variants contain up to 2 groups of variants.");
            }

            Set<String> variantGroupNames = new HashSet<>();
            Map<String, Set<String>> variantsGroupMap = new HashMap<>();
            int countGroupVariant = 1;
            for (VariantGroupRequest groupRequest : productRequest.getVariantsGroup()) { // kiểm tra xem field name của variantsGroup không được trùng nhau
                if (!variantGroupNames.add(groupRequest.getName())) {
                    throw new UnprocessableException(groupRequest.getName() + " is the same as the variation name of another variation");
                }

                if(groupRequest.getVariants().isEmpty() || groupRequest.getVariants().size() > 50) {
                    throw new UnprocessableException("In a group of variants containing only 1 to 50 variants.");
                }

                VariantGroup variantGroupBuild;
                boolean checkTypeUUIDVariantGroup = CheckTypeUUID.isValidUUID(groupRequest.getId());
                // nếu checkTypeUUID là true thì update dựa trên id đó luôn
                // nếu như id đó không tồn tại trong database thì nó tự tạo mới
                if(checkTypeUUIDVariantGroup) {
                    Optional<VariantGroup> variantGroupOptional = variantGroupRepository.findById(UUID.fromString(groupRequest.getId()));
                    if(variantGroupOptional.isPresent()){
                        if(!Objects.equals(variantGroupOptional.get().getName(), groupRequest.getName())) {
                            isUpdateStatus = true;
                            System.out.println("isUpdateStatus 5");
                        }
                        variantGroupBuild = variantGroupOptional.get();
                        variantGroupBuild.setName(groupRequest.getName());
                        variantGroupBuild.setIsPrimary(groupRequest.getIsPrimary());
                        variantGroupBuild.setProduct(productOptional.get());
                        variantGroupBuild.setSortOrder(countGroupVariant);
                    } else {
                        isUpdateStatus = true;
                        System.out.println("isUpdateStatus 6");
                        variantGroupBuild = VariantGroup.createVariantGroup(groupRequest, countGroupVariant, productOptional.get());
                    }
                } else {
                    isUpdateStatus = true;
                    System.out.println("isUpdateStatus 7");
                    variantGroupBuild = VariantGroup.createVariantGroup(groupRequest, countGroupVariant, productOptional.get());
                }

                VariantGroup variantGroupResult = variantGroupRepository.save(variantGroupBuild);
                variantGroups.add(variantGroupResult);

                Set<String> variantNames = new HashSet<>();
                Set<String> variantIds = new HashSet<>();
                int countVariant = 1;
                for (VariantRequest variantRequest : groupRequest.getVariants()) {
                    if (!variantNames.add(variantRequest.getName())) { // kiểm tra xem các field name của variant không được trùng nhau
                        throw new UnprocessableException(variantRequest.getName() + " is the same as the variant name of another variant");
                    }

                    if (!groupRequest.getIsPrimary() && (variantRequest.getVariantImage().getImageUrl() != null)) { //kiểm tra isPrimary là true thì variant mới được chứa hình ảnh hoặc null
                        throw new UnprocessableException("IsPrimary field is true, then the new variant will contain an image or null");
                    }

                    if(variantRequest.getVariantImage().getId() != null) {
                        boolean checkTypeUUIDPreviewImage = CheckTypeUUID.isValidUUID(variantRequest.getVariantImage().getId());
                        if(checkTypeUUIDPreviewImage) previewImageRepository.deleteById(UUID.fromString(variantRequest.getVariantImage().getId()));
                    }

                    Variant variantBuild;
                    boolean checkTypeUUIDVariant = CheckTypeUUID.isValidUUID(variantRequest.getId());
                    // nếu checkTypeUUID là true thì update dựa trên id đó luôn
                    // nếu như id đó không tồn tại trong database thì nó tự tạo mới
                    if(checkTypeUUIDVariant) {
                        Optional<Variant> variantOptional = variantRepository.findById(UUID.fromString(variantRequest.getId()));
                        if(variantOptional.isPresent()){
                            if(!Objects.equals(variantOptional.get().getName(), variantRequest.getName())) {
                                isUpdateStatus = true;
                                System.out.println("isUpdateStatus 8");
                            }
                            variantBuild = variantOptional.get();
                            variantBuild.setName(variantRequest.getName());
                            variantBuild.setImageUrl(variantRequest.getVariantImage().getImageUrl());
                            variantBuild.setVariantGroup(variantGroupResult);
                            variantBuild.setSortOrder(countVariant);
                        } else {
                            isUpdateStatus = true;
                            System.out.println("isUpdateStatus 9");
                            variantBuild = Variant.createVariant(variantRequest.getName(), variantRequest.getVariantImage().getImageUrl(), countVariant, variantGroupResult);
                        }
                    } else {
                        isUpdateStatus = true;
                        System.out.println("isUpdateStatus 10");
                        variantBuild = Variant.createVariant(variantRequest.getName(), variantRequest.getVariantImage().getImageUrl(), countVariant, variantGroupResult);
                    }

                    Variant variantResult = variantRepository.save(variantBuild);
                    variantIds.add(variantResult.getId().toString());

                    for(ProductVariantRequest productVariantRequest : productRequest.getProductVariants()){
                        if(productVariantRequest.getVariantsGroup1Id() != null
                                && productVariantRequest.getVariantsGroup1Id().equals(groupRequest.getId())
                                && productVariantRequest.getVariant1Id() != null
                                && productVariantRequest.getVariant1Id().equals(variantRequest.getId())){
                            productVariantRequest.setVariant1Id(variantResult.getId().toString());
                            productVariantRequest.setVariantsGroup1Id(variantGroupResult.getId().toString());
                        }
                        if(productVariantRequest.getVariantsGroup2Id() != null
                                && productVariantRequest.getVariantsGroup2Id().equals(groupRequest.getId())
                                && productVariantRequest.getVariant2Id() != null
                                && productVariantRequest.getVariant2Id().equals(variantRequest.getId())){
                            productVariantRequest.setVariant2Id(variantResult.getId().toString());
                            productVariantRequest.setVariantsGroup2Id(variantGroupResult.getId().toString());
                        }
                    }
                    variants.add(variantResult);
                    countVariant++;
                }
                variantsGroupMap.put(variantGroupResult.getId().toString(), variantIds);
                countGroupVariant++;
            }

            Set<String> variantPairs = new HashSet<>();
            Set<String> variantExistsOneVariantGroup = new HashSet<>();

            for (ProductVariantRequest productVariantRequest : productRequest.getProductVariants()) {
                String group1 = productVariantRequest.getVariantsGroup1Id();
                String group2 = productVariantRequest.getVariantsGroup2Id();

                // Kiểm tra variantsGroup1 phải tồn tại trong variantsGroupMap
                if (!variantsGroupMap.containsKey(group1)) {
                    throw new UnprocessableException("The variantsGroup1Id field named " + group1 + " must exist in variations.");
                }

                // Kiểm tra variant1Id phải tồn tại trong variantsGroup1
                if (!variantsGroupMap.get(group1).contains(productVariantRequest.getVariant1Id())) {
                    throw new UnprocessableException("The variant1Id field named " + productVariantRequest.getVariant1Id() + " must exist in variations " + group1);
                }

                // Kiểm tra giá sản phẩm không được null hoặc bé hơn 1000 và lớn hơn 120,000,000
                if (productVariantRequest.getPrice() == null || productVariantRequest.getPrice() <= 1000 || productVariantRequest.getPrice() > 120000000) {
                    throw new UnprocessableException("The product price field cannot be empty and must be between 1,000 and 120,000,000.");
                }

                // Kiểm tra StockQuantity phải lớn hơn 0 và bé hơn 10,000,000
                if (productVariantRequest.getStockQuantity() == null || productVariantRequest.getStockQuantity() < 0 || productVariantRequest.getStockQuantity() > 10000000) {
                    throw new UnprocessableException("The product stock field must be greater than 0 and less than 10,000,000.");
                }

                // Kiểm tra khi chỉ có một variantsGroup thì sẽ không có variantsGroup2 và variant2Id trong productVariant
                if (variantGroups.size() == 1 && productVariantRequest.getVariantsGroup2Id() == null && productVariantRequest.getVariant2Id() == null) {

                    // Kiểm tra chỉ có một variant1Id trong mỗi variantsGroup1
                    if (!variantExistsOneVariantGroup.add(productVariantRequest.getVariant1Id())) {
                        throw new UnprocessableException("Only one variant1Id is allowed in variantsGroup1");
                    }

                    // Tìm variant1 và thiết lập vào productVariantBuild
                    Variant variant1 = null;
                    for (Variant variant : variants) {
                        if (variant.getId().toString().equals(productVariantRequest.getVariant1Id())) {
                            variant1 = variant;
                            break;
                        }
                    }

                    ProductVariant productVariantBuild;
                    boolean checkTypeUUIDProductVariant = CheckTypeUUID.isValidUUID(productVariantRequest.getId());
                    // nếu checkTypeUUID là true thì update dựa trên id đó luôn
                    // nếu như id đó không tồn tại trong database thì nó tự tạo mới
                    if(checkTypeUUIDProductVariant) {
                        Optional<ProductVariant> productVariantOptional = productVariantRepository.findById(UUID.fromString(productVariantRequest.getId()));
                        if (productVariantOptional.isPresent()){
                            productVariantBuild = productVariantOptional.get();
                            productVariantBuild.setPrice(productVariantRequest.getPrice());
                            productVariantBuild.setStockQuantity(productVariantRequest.getStockQuantity());
                            productVariantBuild.setProduct(productOptional.get());
                            productVariantBuild.setVariant1(variant1);
                            productVariantBuild.setVariant2(null);
                        } else {
                            productVariantBuild = ProductVariant.createProductVariant(productVariantRequest, productOptional.get(), variant1, null);
                        }
                    } else {
                        productVariantBuild = ProductVariant.createProductVariant(productVariantRequest, productOptional.get(), variant1, null);
                    }

                    ProductVariant productVariant = productVariantRepository.save(productVariantBuild);
                    productVariants.add(productVariant);
                } else {
                    // Kiểm tra variantsGroup1 và variantsGroup2 không được giống nhau
                    if (group1.equals(group2)) {

                        throw new RuntimeException("variantsGroup1 and variantsGroup2 must be different");
                    }

                    // Kiểm tra variantsGroup1 và variantsGroup2 phải tồn tại trong variantsGroupMap
                    if (!variantsGroupMap.containsKey(group1) || !variantsGroupMap.containsKey(group2)) {
                        throw new UnprocessableException("variantsGroup1 " + group1 + " or variantsGroup2 " + group2 + " not found");
                    }

                    // Kiểm tra variant2Id phải tồn tại trong variantsGroup2
                    if (!variantsGroupMap.get(group2).contains(productVariantRequest.getVariant2Id())) {
                        throw new UnprocessableException("The variant1Id field named " + productVariantRequest.getVariant2Id() + " must exist in variations " + group2);
                    }

                    // Kiểm tra cặp variant1Id và variant2Id không được trùng nhau
                    String variantPair = productVariantRequest.getVariant1Id() + "-" + productVariantRequest.getVariant2Id();
                    if (!variantPairs.add(variantPair)) {
                        throw new UnprocessableException("Variant pair " + variantPair + " already exists");
                    }

                    // Tạo ProductVariant và thiết lập variant1 và variant2 vào đó
                    Variant variant1 = null;
                    Variant variant2 = null;
                    for (Variant variant : variants) {
                        if (variant.getId().toString().equals(productVariantRequest.getVariant1Id())) {
                            variant1 = variant;
                        }
                        if (variant.getId().toString().equals(productVariantRequest.getVariant2Id())) {
                            variant2 = variant;
                        }
                    }

                    ProductVariant productVariantBuild;
                    boolean checkTypeUUIDProductVariant = CheckTypeUUID.isValidUUID(productVariantRequest.getId());
                    // nếu checkTypeUUID là true thì update dựa trên id đó luôn
                    // nếu như id đó không tồn tại trong database thì nó tự tạo mới
                    if(checkTypeUUIDProductVariant) {
                        Optional<ProductVariant> productVariantOptional = productVariantRepository.findById(UUID.fromString(productVariantRequest.getId()));
                        if (productVariantOptional.isPresent()){
                            productVariantBuild = productVariantOptional.get();
                            productVariantBuild.setPrice(productVariantRequest.getPrice());
                            productVariantBuild.setStockQuantity(productVariantRequest.getStockQuantity());
                            productVariantBuild.setProduct(productOptional.get());
                            productVariantBuild.setVariant1(variant1);
                            productVariantBuild.setVariant2(variant2);
                        } else {
                            productVariantBuild = ProductVariant.createProductVariant(productVariantRequest, productOptional.get(), variant1, variant2);
                        }
                    } else {
                        productVariantBuild = ProductVariant.createProductVariant(productVariantRequest, productOptional.get(), variant1, variant2);
                    }
                    ProductVariant productVariant = productVariantRepository.save(productVariantBuild);
                    productVariants.add(productVariant);
                }
            }
        }

        // xóa dữ liệu cũ
        List<VariantGroup> findAllVariantGroup = variantGroupRepository.findAllVariantGroupByProductId(UUID.fromString(productRequest.getId()));
        List<ProductVariant> findAllProductVariant = productVariantRepository.findAllProductVariantByProductId(UUID.fromString(productRequest.getId()));
        if(!findAllVariantGroup.isEmpty()) {
            for (VariantGroup variantGroup : findAllVariantGroup){
                VariantGroup foundVariantGroup = ArrayUtils.findById(variantGroups, variantGroupUpdate -> variantGroupUpdate.getId().equals(variantGroup.getId()));
                List<Variant> findAllVariants = variantRepository.findAllVariantsByVariantGroupId(variantGroup.getId());
                // kiểm tra xem variant group có trong dữ liệu cập nhật không
                // nếu không thì xóa variant group đó đi
                // trước khi xóa variant group phải xoá hết các collection của variant có foreignKey là primaryKey của variant group
                if (foundVariantGroup == null) {
                    for (Variant variantToDelete : findAllVariants) {
                        // trước khi xóa variant thì phải xóa hết các collection của product variant có foreignKey là primaryKey của variant
                        for (ProductVariant productVariantToDelete : findAllProductVariant) {
                            if(variantGroup.getIsPrimary()) {
                                if(productVariantToDelete.getVariant1().getId() == variantToDelete.getId()){
                                    productVariantRepository.delete(productVariantToDelete);
                                }
                            } else {
                                if(productVariantToDelete.getVariant2().getId() == variantToDelete.getId()){
                                    productVariantRepository.delete(productVariantToDelete);
                                }
                            }
                        }
                        variantRepository.delete(variantToDelete);
                    }
                    variantGroupRepository.delete(variantGroup);
                } else {
                    if(!findAllVariants.isEmpty()){
                        for (Variant variantToDelete : findAllVariants){
                            // nếu variant là variant cũ mà người dùng đã xóa nó thì xử lý xóa variant đó
                            // bởi vì khi người dùng xóa nó thì không call api ma chỉ xóa trong yup
                            // khi đẩy qua cho bên BE xử lý phải loại bỏ nó khỏi db
                            Variant foundVariant = ArrayUtils.findById(variants, variantUpdate -> variantUpdate.getId() == variantToDelete.getId());
                            if (foundVariant == null) {
                                // trước khi xóa variant thì phải xóa hết các collection của product variant có foreignKey là primaryKey của variant
                                for (ProductVariant productVariantToDelete : findAllProductVariant) {
                                    if(variantGroup.getIsPrimary()) {
                                        if(productVariantToDelete.getVariant1().getId() == variantToDelete.getId()){
                                            productVariantRepository.delete(productVariantToDelete);
                                        }
                                    } else {
                                        if(productVariantToDelete.getVariant2().getId() == variantToDelete.getId()){
                                            productVariantRepository.delete(productVariantToDelete);
                                        }
                                    }
                                }
                                variantRepository.delete(variantToDelete);
                            }
                        }
                    }
                }
            }
        }

        if(!variantGroups.isEmpty()){
            for (VariantGroup variantGroup : variantGroups){
                List<Variant> variantList = new ArrayList<>();
                for (Variant variant : variants){
                    if(variantGroup.getId().equals(variant.getVariantGroup().getId())){
                        variantList.add(variant);
                    }
                }
                variantGroup.setVariants(variantList);

            }
        }

        Optional<HistoryViolation> violationOptional = historyViolationRepository.findByProductIdAndIsRepaired(productOptional.get().getId(), false);
        if(violationOptional.isPresent()) {
            // neu nhu san pham vi pham, kiem tra san phan co thay doi noi dung kh
            // neu khong thay doi ma muon cap nhap trang thai thi tra ve loi
            if(!isUpdateStatus) {
                throw new BadRequestException("The product is in violation. Please edit the content or images to comply before saving the product.");
            }

            HistoryViolation violation = violationOptional.get();
            violation.setIsRepaired(true);
            historyViolationRepository.save(violation);
            if(productRequest.getIsActive()) {
                productOptional.get().setStatus(StatusProduct.PENDING_APPROVAL.getValue());
            } else {
                productOptional.get().setStatus(StatusProduct.UNLISTED.getValue());
            }
        } else {
            if(isUpdateStatus) {
                if(productRequest.getIsActive()) {
                    productOptional.get().setStatus(StatusProduct.PENDING_APPROVAL.getValue());
                } else {
                    productOptional.get().setStatus(StatusProduct.UNLISTED.getValue());
                }
            } else {
                if(!productRequest.getIsActive()) {
                    productOptional.get().setIsActive(false);
                }
            }
        }

        Product productResult = productRepository.save(productOptional.get());

        productResult.setProductVariants(productVariants);
        productResult.setVariantsGroup(variantGroups);
        productResult.setProductImages(productImages);

        modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
        });

        modelMapper.map(productResult, ProductResponse.class);
        return modelMapper.map(productResult, ProductResponse.class);
    }

    @Override
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public ProductDetailForUserResponse getProductByIdForUser(String id, String shopId, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        Optional<Product> productOptional = productRepository.findByProductIdForUser(UUID.fromString(id), UUID.fromString(shopId), StatusProduct.FOR_SALE.getValue());
        if(productOptional.isEmpty()){
            throw new NotFoundException("Product not found with id: " + id);
        }

        Product product = ProductUtils.sortOrderInfoOfProduct(productOptional.get());
        modelMapper.typeMap(Product.class, ProductDetailForUserResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
        });
        ProductDetailForUserResponse response = modelMapper.map(product, ProductDetailForUserResponse.class);
        Optional<ProductFavorite> favoriteOptional = productFavoriteRepository.findByProductIdAndAccountId(product.getId(), product.getShop().getId());
        Optional<Seller> optionalSeller = sellerRepository.findByShopId(product.getShop().getId());
        if(optionalSeller.isPresent()) {
            SellerInfoResponse sellerInfoResponse = modelMapper.map(optionalSeller.get(), SellerInfoResponse.class);
            response.setSeller(sellerInfoResponse);
        }
        response.setIsFavorite(favoriteOptional.isPresent());
        response.setIsProductOfShop(parseJwtToAccount.getId() == product.getShop().getId());

        return response;
    }

    @Override
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public ProductResponse getProductById(String id) {
        Optional<Product> productOptional = productRepository.findByProductIdOfProduct(UUID.fromString(id));
        if(productOptional.isEmpty()){
            throw new NotFoundException("Product not found with id: " + id);
        } else {
            Product product = ProductUtils.sortOrderInfoOfProduct(productOptional.get());
            modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
                mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
            });
            return modelMapper.map(product, ProductResponse.class);
        }
    }

    @Override
    public List<ProductResponse> updateStatusListProduct(UpdateStatusRequest updateStatusRequest, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        List<Product> productsSave = new ArrayList<>();
        for (String productId : updateStatusRequest.getListProductId()) {
            Optional<Product> findProduct = productRepository.findByProductIdAndIsActiveOfProductOfShop(UUID.fromString(productId), parseJwtToAccount.getId(), !updateStatusRequest.getIsActive());
            if(findProduct.isEmpty()){
                throw new NotFoundException(productId + " does not exists in database.");
            }

            Product product = findProduct.get();
            if(updateStatusRequest.getIsActive()){
                product.setStatus(StatusProduct.PENDING_APPROVAL.value());
            } else {
                product.setStatus(StatusProduct.UNLISTED.value());
            }

            product.setIsActive(updateStatusRequest.getIsActive());
            productsSave.add(product);
        }

        List<Product> productListResponse = productRepository.saveAll(productsSave);
        modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
        });
        return productListResponse.stream()
                .map(product -> modelMapper.map(ProductUtils.sortOrderInfoOfProduct(product), ProductResponse.class))
                .toList();
    }

    @Override
    public void deleteListProduct(DeleteProductsRequest request, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        for (String productId : request.getListProductId()) {
            Optional<Product> findProduct = productRepository.findByProductIdOfProductOfShop(UUID.fromString(productId), parseJwtToAccount.getId());
            if(findProduct.isEmpty()){
                throw new NotFoundException(productId + " does not exists in database.");
            }

            Product product = findProduct.get();
            product.setIsDeleted(true);
            productRepository.save(product);
        }
    }

    @Override
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public ListProductInfoOfShopResponse getListProductOfShop(QueryParameters queryParameters, String jwtToken) {
        Account parseJwtToAccount = jwtTokenService.parseJwtTokenToAccount(jwtToken);
        int page = queryParameters.getPage() != null ? Integer.parseInt(queryParameters.getPage()) - 1 : 0;
        int limit = queryParameters.getLimit() != null ? Integer.parseInt(queryParameters.getLimit()) : 20;
        String searchValue = queryParameters.getSearch() != null ? queryParameters.getSearch() : null;

        Sort.Direction direction = Sort.Direction.DESC;
        if ("ASC".equalsIgnoreCase(queryParameters.getOrder())) {
            direction = Sort.Direction.ASC;
        }

        String sortBy = queryParameters.getSort_by();
        Sort sort = Sort.by(direction, "updatedAt");

        if ("price".equalsIgnoreCase(sortBy)) {
            sort = JpaSort.unsafe(direction, "COALESCE((SELECT MIN(pv.price) FROM ProductVariant pv WHERE pv.product.id = p.id), p.price)");
        } else if ("stock".equalsIgnoreCase(sortBy)) {
            sort = JpaSort.unsafe(direction, "COALESCE((SELECT SUM(pv.stockQuantity) FROM ProductVariant pv WHERE pv.product.id = p.id), p.stockQuantity)");
        } else if ("sold".equalsIgnoreCase(sortBy) || "sales".equalsIgnoreCase(sortBy)) {
            sort = JpaSort.unsafe(direction, "productFigure.sold");
        }

        String status = null;
        if (queryParameters.getStatus() != null && !queryParameters.getStatus().isEmpty()) {
            try {
                status = StatusProduct.fromValue(queryParameters.getStatus()).getValue();
                if(Objects.equals(status, StatusProduct.UNLISTED)){

                }
            } catch (IllegalArgumentException e) {
                throw new UnprocessableException("Invalid status value: " + queryParameters.getStatus());
            }
        }

        UUID violationType = null;
        if (queryParameters.getViolationType() != null && !queryParameters.getViolationType().isEmpty()) {
                Optional<TypeViolation> violationOptional = typeViolationRepository.findById(UUID.fromString(queryParameters.getViolationType()));
                if(violationOptional.isPresent()) {
                    violationType = violationOptional.get().getId();
                }
        }

        String categoryId = null;
        if (queryParameters.getCategory() != null && !queryParameters.getCategory().isEmpty()) {
            categoryId = queryParameters.getCategory();
        }

        Pageable sortedPageable = PageRequest.of(page, limit, sort);
        Page<Product> products = productRepository.findListProductOfShop(
                sortedPageable,
                categoryId,
                parseJwtToAccount.getId(),
                searchValue,
                status,
                violationType);

        ListProductInfoOfShopResponse response = new ListProductInfoOfShopResponse();
        modelMapper.typeMap(Product.class, ProductDetailForShopResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getShop().getId(), ProductDetailForShopResponse::setShopId);
        });
        Page<ProductDetailForShopResponse> mapListProduct = products.map(
                product -> modelMapper.map(ProductUtils.sortOrderInfoOfProduct(product), ProductDetailForShopResponse.class)
        );
        response.setListProduct(mapListProduct);
        List<String> listCategoryId = productRepository.findListCategoryOfShop(parseJwtToAccount.getId());
        if(!listCategoryId.isEmpty()) {
            List<String> listCategoryChild = new ArrayList<>();
            for (String categoriesId : listCategoryId) {
                List<String> arrayCategories = Arrays.stream(categoriesId.split("\\.")).toList();
                listCategoryChild.add(arrayCategories.get(arrayCategories.size() - 1));
            }
            response.setListCategoryId(listCategoryChild);
        }

        return response;
    }

    @Override
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public Page<ProductResponse> getListProductOfCategoryForUser(QueryParameters queryParameters) {
        Pageable sortedPageable = ProductUtils.createPageableForUser(queryParameters);
        double ratingStart = ProductUtils.getRatingStart(queryParameters);
        Double minPrice = ProductUtils.getMinPrice(queryParameters);
        Double maxPrice = ProductUtils.getMaxPrice(queryParameters);

        String conditionProduct = null;
        if (queryParameters.getCondition() != null && !queryParameters.getCondition().isEmpty()) {
            try {
                conditionProduct = ConditionProduct.fromValue(queryParameters.getCondition()).getValue();
            } catch (IllegalArgumentException e) {
                throw new UnprocessableException("Invalid status value: " + queryParameters.getStatus());
            }
        }

        if (!queryParameters.getCategory().isEmpty()) {
            Page<Product> products = productRepository.findListProductOfCategoryForUser(
                    sortedPageable,
                    queryParameters.getCategory(),
                    ratingStart,
                    minPrice,
                    maxPrice,
                    conditionProduct,
                    StatusProduct.FOR_SALE.getValue());

            modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
                mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
            });

            return products.map(product -> modelMapper.map(ProductUtils.sortOrderInfoOfProduct(product), ProductResponse.class));
        }

        return new PageImpl<>(Collections.emptyList(), sortedPageable, 0);
    }
    @Override
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public List<ProductResponse> getListProductOfCategoryForUserMobile(QueryParameters queryParameters) {
        Pageable sortedPageable = ProductUtils.createPageableForUser(queryParameters);
        double ratingStart = ProductUtils.getRatingStart(queryParameters);
        Double minPrice = ProductUtils.getMinPrice(queryParameters);
        Double maxPrice = ProductUtils.getMaxPrice(queryParameters);
        String conditionProduct = null;
        if (queryParameters.getCondition() != null && !queryParameters.getCondition().isEmpty()) {
            try {
                conditionProduct = ConditionProduct.fromValue(queryParameters.getCondition()).getValue();
            } catch (IllegalArgumentException e) {
                throw new UnprocessableException("Invalid status value: " + queryParameters.getStatus());
            }
        }

        if (!queryParameters.getCategory().isEmpty()) {
            Page<Product> products = productRepository.findListProductOfCategoryForUser(
                    sortedPageable,
                    queryParameters.getCategory(),
                    ratingStart,
                    minPrice,
                    maxPrice,
                    conditionProduct,
                    StatusProduct.FOR_SALE.getValue());

            modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
                mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
            });

            return products.getContent()
                    .stream()
                    .map(product -> modelMapper.map(ProductUtils.sortOrderInfoOfProduct(product), ProductResponse.class))
                    .collect(Collectors.toList());
        }

        return Collections.emptyList();
    }

    @Override
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public Page<ProductResponse> getListProductRecommendation(QueryParameters queryParameters, String jwtToken) {
        int page = queryParameters.getPage() != null ? Integer.parseInt(queryParameters.getPage()) - 1 : 0;
        int limit = queryParameters.getLimit() != null ? Integer.parseInt(queryParameters.getLimit()) : 20;

        double ratingStart = 5.0;
        if (queryParameters.getRating_filter() != null && !queryParameters.getRating_filter().isEmpty()) {
            try {
                ratingStart = Double.parseDouble(queryParameters.getRating_filter());
            } catch (NumberFormatException e) {
                System.out.println("Invalid rating_filter value: " + queryParameters.getRating_filter());
            }
        }


        Pageable sortedPageable = PageRequest.of(page, limit);
        Page<Product> productPage = productRepository.findListProductRecommendationForUser(
                sortedPageable,
                ratingStart,
                StatusProduct.FOR_SALE.getValue());

        modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
        });

        return productPage.map(product -> modelMapper.map(ProductUtils.sortOrderInfoOfProduct(product), ProductResponse.class));
    }

    @Override
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public List<ProductResponse> getListProductRecommendationMobile(QueryParameters queryParameters, String jwtToken) {
        int page = queryParameters.getPage() != null ? Integer.parseInt(queryParameters.getPage()) - 1 : 0;
        int limit = queryParameters.getLimit() != null ? Integer.parseInt(queryParameters.getLimit()) : 20;

        double ratingStart = 5.0;
        if (queryParameters.getRating_filter() != null && !queryParameters.getRating_filter().isEmpty()) {
            try {
                ratingStart = Double.parseDouble(queryParameters.getRating_filter());
            } catch (NumberFormatException e) {
                System.out.println("Invalid rating_filter value: " + queryParameters.getRating_filter());
            }
        }

        Pageable sortedPageable = PageRequest.of(page, limit);
        Page<Product> productPage = productRepository.findListProductRecommendationForUser(
                sortedPageable,
                ratingStart,
                StatusProduct.FOR_SALE.getValue());

        modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
        });

        return productPage
                .getContent()
                .stream()
                .map(product -> modelMapper.map(ProductUtils.sortOrderInfoOfProduct(product), ProductResponse.class))
                .collect(Collectors.toList());

    }

    @Override
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public ListProductInfoForAdminResponse getListProductForAdmin(QueryParameters queryParameters, String jwtToken) {
        int page = queryParameters.getPage() != null ? Integer.parseInt(queryParameters.getPage()) - 1 : 0;
        int limit = queryParameters.getLimit() != null ? Integer.parseInt(queryParameters.getLimit()) : 20;
        String searchValue = queryParameters.getSearch() != null ? queryParameters.getSearch() : null;

        Sort.Direction direction = Sort.Direction.DESC;
        if ("ASC".equalsIgnoreCase(queryParameters.getOrder())) {
            direction = Sort.Direction.ASC;
        }

        String status = null;
        if (queryParameters.getStatus() != null && !queryParameters.getStatus().isEmpty()) {
            try {
                status = StatusProduct.fromValue(queryParameters.getStatus()).getValue();
            } catch (IllegalArgumentException e) {
                throw new UnprocessableException("Invalid status value: " + queryParameters.getStatus());
            }
        }

        Sort sort = Sort.by(direction, "updatedAt");
        Pageable sortedPageable = PageRequest.of(page, limit, sort);

        Page<Product> products = productRepository.findListProductForAdmin(
                sortedPageable,
                queryParameters.getCategory(),
                searchValue,
                status);

        ListProductInfoForAdminResponse response = new ListProductInfoForAdminResponse();
        Page<ProductDetailForAdminResponse> mapListProduct = products.map(
                product -> modelMapper.map(ProductUtils.sortOrderInfoOfProduct(product), ProductDetailForAdminResponse.class)
        );
        response.setListProduct(mapListProduct);
        List<String> listCategoryId = productRepository.findListCategoryUsed(status);
        if(!listCategoryId.isEmpty()) {
            List<String> listCategoryChild = new ArrayList<>();
            for (String categoriesId : listCategoryId) {
                List<String> arrayCategories = Arrays.stream(categoriesId.split("\\.")).toList();
                listCategoryChild.add(arrayCategories.get(arrayCategories.size() - 1));
            }
            response.setListCategoryId(listCategoryChild);
        }

        return response;
    }

    @Override
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public ProductResponse getProductByIdOfShop(String id, String shopId) {
        Optional<Product> productOptional = productRepository.findByProductIdOfProductOfShop(UUID.fromString(id), UUID.fromString(shopId));
        if(productOptional.isEmpty()){
            throw new NotFoundException("Product not found with id: " + id);
        }

        Product product = ProductUtils.sortOrderInfoOfProduct(productOptional.get());
        modelMapper.typeMap(Product.class, ProductResponse.class).addMappings(mapper -> {
            mapper.map(src -> src.getShop().getId(), ProductResponse::setShopId);
        });
        return modelMapper.map(product, ProductResponse.class);
    }

    @Override
    public void listingProductsForSale(List<String> stringIds) {
        List<Product> productList = new ArrayList<>();
        for(String productId : stringIds) {
            Optional<Product> productOptional = productRepository.findById(UUID.fromString(productId));
            if(Objects.equals(StatusProduct.PENDING_APPROVAL.getValue(), productOptional.get().getStatus())) {
                Product product = productOptional.get();
                product.setStatus(StatusProduct.FOR_SALE.getValue());
//                product.setIsCensored(true);
                productList.add(product);
            }
        }
        productRepository.saveAll(productList);
    }


    private void checkCategory(String categories) {
        if(categories.isEmpty()){
            throw new UnprocessableException("The categoryId field can't be empty.");
        } else {
            List<String> listCategoryParentId = Arrays.stream(categories.split("\\.")).toList();
            for (String categoryId : listCategoryParentId) {
                int categoryIdInt;
                try {
                    categoryIdInt = Integer.parseInt(categoryId);
                } catch (NumberFormatException e) {
                    throw new UnprocessableException("Invalid categoryId format: " + categoryId);
                }

                Optional<Category> resultCateFindById = categoryRepository.findById(categoryIdInt);
                if (resultCateFindById.isEmpty()) {
                    throw new NotFoundException("Category ID " + categoryId + " does not exist");
                }
            }
        }
    }
}
