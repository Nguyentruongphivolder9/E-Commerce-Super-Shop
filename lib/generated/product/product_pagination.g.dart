// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/product/product_pagination.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductPagination _$ProductPaginationFromJson(Map<String, dynamic> json) =>
    ProductPagination(
      listProducts: json['listProducts'] != null
          ? (json['listProducts'] as List<dynamic>)
              .map((e) => Product.fromJson(e as Map<String, dynamic>))
              .toList()
          : null,
      totalPages: (json['totalPages'] as num).toInt(),
    );
