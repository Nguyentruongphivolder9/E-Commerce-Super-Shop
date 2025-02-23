// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/product/product_image.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductImage _$ProductImageFromJson(Map<String, dynamic> json) => ProductImage(
      id: json['id'] as String,
      imageUrl: json['imageUrl'] as String,
      isPrimary: json['isPrimary'] as bool,
    );

Map<String, dynamic> _$ProductImageToJson(ProductImage instance) =>
    <String, dynamic>{
      'id': instance.id,
      'imageUrl': instance.imageUrl,
      'isPrimary': instance.isPrimary,
    };
