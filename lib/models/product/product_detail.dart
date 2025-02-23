import 'package:supershop_app/models/account/seller_response.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/product/product_figure.dart';
import 'package:supershop_app/models/product/product_image.dart';
import 'package:supershop_app/models/product/product_variant.dart';
import 'package:supershop_app/models/product/variants_group.dart';

part '../../generated/product/product_detail.g.dart';

@JsonSerializable()
class ProductDetailForUser extends Product {
  final bool isFavorite;
  final bool isProductOfShop;
  final SellerInfoResponse seller;

  ProductDetailForUser({
    required super.id,
    required super.shopId,
    required super.categoryId,
    required super.name,
    super.price,
    super.stockQuantity,
    required super.description,
    required super.conditionProduct,
    required super.isVariant,
    required super.isActive,
    required super.isDeleted,
    required super.brand,
    required super.status,
    required super.productImages,
    super.variantsGroup,
    super.productVariants,
    required super.productFigure,
    required super.createdAt,
    required super.updatedAt,
    required this.isFavorite,
    required this.isProductOfShop,
    required this.seller,
  });

  factory ProductDetailForUser.fromJson(Map<String, dynamic> json) =>
      _$ProductDetailForUserFromJson(json);

  Map<String, dynamic> toJson() => _$ProductDetailForUserToJson(this);
}
