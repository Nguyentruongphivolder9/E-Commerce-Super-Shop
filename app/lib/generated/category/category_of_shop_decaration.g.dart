// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/category/category_of_shop_decoration.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CategoryOfShopDecoration _$CategoryOfShopDecorationFromJson(
        Map<String, dynamic> json) =>
    CategoryOfShopDecoration(
      id: json['id'] as String,
      name: json['name'] as String,
      listProducts: json['listProducts'] != null
          ? (json['listProducts'] as List<dynamic>)
              .map((e) => Product.fromJson(e as Map<String, dynamic>))
              .toList()
          : null,
    );
