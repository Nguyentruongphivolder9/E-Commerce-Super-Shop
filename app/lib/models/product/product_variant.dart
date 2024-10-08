import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/product/variant.dart';

part '../../generated/product/product_variant.g.dart';

@JsonSerializable()
class ProductVariant {
  final String id;
  final double price;
  final int stockQuantity;
  final Variant variant1;
  final Variant? variant2;

  ProductVariant({
    required this.id,
    required this.price,
    required this.stockQuantity,
    required this.variant1,
    this.variant2,
  });

  factory ProductVariant.fromJson(Map<String, dynamic> json) =>
      _$ProductVariantFromJson(json);

  Map<String, dynamic> toJson() => _$ProductVariantToJson(this);
}
