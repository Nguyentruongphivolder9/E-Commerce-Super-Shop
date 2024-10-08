// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/product/product_variant.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductVariant _$ProductVariantFromJson(Map<String, dynamic> json) =>
    ProductVariant(
      id: json['id'] as String,
      price: (json['price'] as num).toDouble(),
      stockQuantity: (json['stockQuantity'] as num).toInt(),
      variant1: Variant.fromJson(json['variant1'] as Map<String, dynamic>),
      variant2: json['variant2'] != null
          ? Variant.fromJson(json['variant2'] as Map<String, dynamic>)
          : null,
    );

Map<String, dynamic> _$ProductVariantToJson(ProductVariant instance) =>
    <String, dynamic>{
      'id': instance.id,
      'price': instance.price,
      'stockQuantity': instance.stockQuantity,
      'variant1': instance.variant1.toJson(),
      'variant2': instance.variant2?.toJson(),
    };
