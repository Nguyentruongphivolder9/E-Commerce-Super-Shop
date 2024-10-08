import 'package:supershop_app/features/cart/extendedModel/extended_cart_item_byshop.dart';
import 'package:supershop_app/main.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:supershop_app/models/product/product_image.dart';
import 'package:supershop_app/models/product/product_variant.dart';

String handleImageProduct(Product product, String productVariantId) {
  if (productVariantId.isNotEmpty) {
    ProductVariant? productVariant = product.productVariants?.firstWhere(
      (pv) => pv.id == productVariantId,
    );

    if (productVariant != null && productVariant.variant1.imageUrl != null) {
      return productVariant.variant1.imageUrl!;
    } else {
      return product.productImages
          .firstWhere(
            (img) => img.isPrimary == true,
          )
          .imageUrl;
    }
  } else {
    return product.productImages
        .firstWhere(
          (img) => img.isPrimary == true,
        )
        .imageUrl;
  }
}

double handlePriceProduct(Product product, String productVariantId) {
  if ((productVariantId.isNotEmpty && (product.price == null || product.price == 0))) {
    ProductVariant? productVariant = product.productVariants?.firstWhere(
      (pv) => pv.id == productVariantId,
    );

    if (productVariant != null) {
      return productVariant.price;
    } else {
      return 0;
    }
  } else {
    return product.price ?? 0;
  }
}

int handleStockQuantityProduct(Product product, String productVariantId) {
  if (productVariantId.isNotEmpty &&
      (product.stockQuantity == null || product.stockQuantity == 0)) {
    if (product.productVariants != null) {
      ProductVariant? productVariant = product.productVariants?.firstWhere(
        (pv) => pv.id == productVariantId,
      );

      if (productVariant != null) {
        return productVariant.stockQuantity;
      }
    }
    return 0;
  } else {
    // Return product stock quantity if no variant or product stock is available
    return product.stockQuantity ?? 0;
  }
}

String hanldeVariantNameByProVariant(String productVariantId, Product product) {
  String variant1Name = '';
  String variant2Name = '';
  if (product.productVariants != null && product.productVariants!.isNotEmpty) {
    for (var productVariant in product.productVariants!) {
      if (productVariant.id == productVariantId) {
        variant1Name = productVariant.variant1.name;

        if (productVariant.variant2 != null) {
          variant2Name = productVariant.variant2!.name;
        }
        return '$variant1Name - $variant2Name';
      }
    }
  }
  return 'No variant';
}

double calculateTotalOrder(List<CartItemExtendedByShop> checkedCartItems) {
  return checkedCartItems.fold(0.0, (result, current) {
    double shopTotal = current.items.fold(0.0, (shopTotal, item) {
      final product = item.product;
      final productVariantsMap = {
        for (var proVariant in product.productVariants!) proVariant.id: proVariant
      };

      final proVariant = item.productVariantId != null &&
              product.productVariants != null &&
              product.productVariants!.isNotEmpty
          ? productVariantsMap[item.productVariantId]
          : null;

      final price = proVariant != null ? proVariant.price : product.price;
      shopTotal += (price ?? 0) * item.quantity;

      return shopTotal;
    });

    return result + shopTotal;
  });
}

double calculateTotalOrderOnshop(List<CartItemExtendedByShop> checkedCartItems, String shopId) {
  return checkedCartItems.where((item) => item.shopInfo['id'] == shopId).fold(0.0,
      (result, current) {
    double shopTotal = current.items.fold(0.0, (shopTotal, item) {
      final product = item.product;
      final productVariantsMap = {
        for (var proVariant in product.productVariants!) proVariant.id: proVariant
      };

      final proVariant = item.productVariantId != null &&
              product.productVariants != null &&
              product.productVariants!.isNotEmpty
          ? productVariantsMap[item.productVariantId]
          : null;

      final price = proVariant != null ? proVariant.price : product.price;
      shopTotal += (price ?? 0) * item.quantity;

      return shopTotal;
    });

    return result + shopTotal;
  });
}
