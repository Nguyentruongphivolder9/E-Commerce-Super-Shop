// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/category/category_of_shop.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CategoryOfShop _$CategoryOfShopFromJson(Map<String, dynamic> json) =>
    CategoryOfShop(
      id: json['id'] as String,
      name: json['name'] as String,
      imageUrl: json['imageUrl'] as String?,
      totalProduct: (json['totalProduct'] as num).toInt(),
      isActive: json['isActive'] as bool,
    );
