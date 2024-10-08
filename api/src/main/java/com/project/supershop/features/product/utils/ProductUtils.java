package com.project.supershop.features.product.utils;

import com.project.supershop.common.QueryParameters;
import com.project.supershop.features.product.domain.entities.Product;
import com.project.supershop.features.product.domain.entities.ProductImage;
import com.project.supershop.features.product.domain.entities.Variant;
import com.project.supershop.features.product.domain.entities.VariantGroup;
import com.project.supershop.handler.UnprocessableException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class ProductUtils {
    public static Product sortOrderInfoOfProduct(Product product) {
        if(!product.getVariantsGroup().isEmpty()){
            List<VariantGroup> variantGroups = product.getVariantsGroup().stream()
                    .sorted(Comparator.comparingInt(VariantGroup::getSortOrder))
                    .collect(Collectors.toList());
            for (VariantGroup variantGroup : variantGroups) {
                if (variantGroup.getVariants() != null && !variantGroup.getVariants().isEmpty()) {
                    List<Variant> sortedVariants = variantGroup.getVariants().stream()
                            .sorted(Comparator.comparingDouble(Variant::getSortOrder)) // Sắp xếp theo price, thay đổi nếu cần
                            .collect(Collectors.toList());
                    variantGroup.setVariants(sortedVariants);
                }
            }
            product.setVariantsGroup(variantGroups);
        }

        if(!product.getProductImages().isEmpty()){
            List<ProductImage> productImages = product.getProductImages().stream()
                    .sorted(Comparator.comparingInt(ProductImage::getSortOrder))
                    .collect(Collectors.toList());
            product.setProductImages(productImages);
        }

        return product;
    }

    public static Pageable createPageableForUser(QueryParameters queryParameters) {
        int page = queryParameters.getPage() != null ? Integer.parseInt(queryParameters.getPage()) - 1 : 0;
        int limit = queryParameters.getLimit() != null ? Integer.parseInt(queryParameters.getLimit()) : 20;

        Sort.Direction direction = Sort.Direction.DESC;
        if ("ASC".equalsIgnoreCase(queryParameters.getOrder())) {
            direction = Sort.Direction.ASC;
        }

        String sortBy = queryParameters.getSort_by();
        Sort sort;

        if ("ctime".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(direction, "createdAt")
                    .and(Sort.by(Sort.Direction.DESC, "productFigure.ratingStar"));
        } else if ("price".equalsIgnoreCase(sortBy)) {
            sort = JpaSort.unsafe(direction, "COALESCE((SELECT MIN(pv.price) FROM ProductVariant pv WHERE pv.product.id = p.id), p.price)")
                    .and(Sort.by(Sort.Direction.DESC, "productFigure.ratingStar"));
        } else if ("sold".equalsIgnoreCase(sortBy) || "sales".equalsIgnoreCase(sortBy)) {
            sort = JpaSort.unsafe(direction, "productFigure.sold")
                    .and(Sort.by(Sort.Direction.DESC, "productFigure.ratingStar"));
        } else {
            sort = Sort.by(Sort.Direction.DESC, "productFigure.ratingStar");
        }


        return PageRequest.of(page, limit, sort);
    }

    public static double getRatingStart(QueryParameters queryParameters) {
        double ratingStart = 5.0;
        if (queryParameters.getRating_filter() != null && !queryParameters.getRating_filter().isEmpty()) {
            try {
                ratingStart = Double.parseDouble(queryParameters.getRating_filter());
            } catch (NumberFormatException e) {
                throw new UnprocessableException("Field ratingStart must have a data type of integer");
            }
        }
        return ratingStart;
    }

    public static Double getMinPrice(QueryParameters queryParameters) {
        if (queryParameters.getPrice_min() != null && !queryParameters.getPrice_min().isEmpty()) {
            return Double.parseDouble(queryParameters.getPrice_min());
        }
        return null;
    }

    public static Double getMaxPrice(QueryParameters queryParameters) {
        if (queryParameters.getPrice_max() != null && !queryParameters.getPrice_max().isEmpty()) {
            return Double.parseDouble(queryParameters.getPrice_max());
        }
        return null;
    }
}
