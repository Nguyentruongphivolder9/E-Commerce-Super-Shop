// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/product/product_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductDetailForUser _$ProductDetailForUserFromJson(Map<String, dynamic> json) {
  return ProductDetailForUser(
    id: json['id'] as String,
    shopId: json['shopId'] as String,
    categoryId: json['categoryId'] as String,
    name: json['name'] as String,
    price: (json['price'] != null) ? (json['price'] as num).toDouble() : null,
    stockQuantity: (json['stockQuantity'] != null)
        ? (json['stockQuantity'] as num).toInt()
        : null,
    description: json['description'] as String,
    conditionProduct: json['conditionProduct'] as String,
    isVariant: json['isVariant'] as bool,
    isActive: json['isActive'] as bool,
    isDeleted: json['isDeleted'] as bool,
    brand: json['brand'] as String,
    status: json['status'] as String,
    productImages: (json['productImages'] as List<dynamic>)
        .map((e) => ProductImage.fromJson(e as Map<String, dynamic>))
        .toList(),
    variantsGroup: json['variantsGroup'] != null
        ? (json['variantsGroup'] as List<dynamic>)
            .map((e) => VariantsGroup.fromJson(e as Map<String, dynamic>))
            .toList()
        : null,
    productVariants: json['productVariants'] != null
        ? (json['productVariants'] as List<dynamic>)
            .map((e) => ProductVariant.fromJson(e as Map<String, dynamic>))
            .toList()
        : null,
    productFigure:
        ProductFigure.fromJson(json['productFigure'] as Map<String, dynamic>),
    createdAt: json['createdAt'] as String,
    updatedAt: json['updatedAt'] as String,
    isFavorite: json['isFavorite'] as bool,
    isProductOfShop: json['isProductOfShop'] as bool,
    seller: SellerInfoResponse.fromJson(json['seller'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$ProductDetailForUserToJson(
    ProductDetailForUser instance) {
  return <String, dynamic>{
    'id': instance.id,
    'shopId': instance.shopId,
    'categoryId': instance.categoryId,
    'name': instance.name,
    'price': instance.price,
    'stockQuantity': instance.stockQuantity,
    'description': instance.description,
    'conditionProduct': instance.conditionProduct,
    'isVariant': instance.isVariant,
    'isActive': instance.isActive,
    'isDeleted': instance.isDeleted,
    'brand': instance.brand,
    'status': instance.status,
    'productImages': instance.productImages.map((e) => e.toJson()).toList(),
    'variantsGroup': instance.variantsGroup?.map((e) => e.toJson()).toList(),
    'productVariants':
        instance.productVariants?.map((e) => e.toJson()).toList(),
    'productFigure': instance.productFigure.toJson(),
    'createdAt': instance.createdAt,
    'updatedAt': instance.updatedAt,
    'isFavorite': instance.isFavorite,
    'isProductOfShop': instance.isProductOfShop,
    'seller': instance.seller.toJson(),
  };
}
