import 'package:supershop_app/models/product/product_figure.dart';
import 'package:supershop_app/models/product/product_image.dart';
import 'package:supershop_app/models/product/product_variant.dart';
import 'package:supershop_app/models/product/variants_group.dart';

import 'package:json_annotation/json_annotation.dart';

part '../../generated/product/product.g.dart';

@JsonSerializable()
class Product {
  late String id;
  late String shopId;
  late String categoryId;
  late String name;
  late double? price;
  late int? stockQuantity;
  late String description;
  late String conditionProduct;
  late bool isVariant;
  late bool isActive;
  late bool isDeleted;
  late String brand;
  late String status;
  late List<ProductImage> productImages;
  late List<VariantsGroup>? variantsGroup;
  late List<ProductVariant>? productVariants;
  late ProductFigure productFigure;
  late String createdAt;
  late String updatedAt;
  Product({
    required this.id,
    required this.shopId,
    required this.categoryId,
    required this.name,
    this.price,
    this.stockQuantity,
    required this.description,
    required this.conditionProduct,
    required this.isVariant,
    required this.isActive,
    required this.isDeleted,
    required this.brand,
    required this.status,
    required this.productImages,
    this.variantsGroup,
    this.productVariants,
    required this.productFigure,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Product.fromJson(Map<String, dynamic> json) =>
      _$ProductFromJson(json);

  Map<String, dynamic> toJson() => _$ProductToJson(this);
}
