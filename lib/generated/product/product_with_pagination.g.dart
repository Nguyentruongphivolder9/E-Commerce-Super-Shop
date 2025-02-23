// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/pagination/product_with_pagination.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductWithPagination _$ProductWithPaginationFromJson(
        Map<String, dynamic> json) =>
    ProductWithPagination(
      data: (json['data'] as List<dynamic>)
          .map((e) => Product.fromJson(e as Map<String, dynamic>))
          .toList(),
      totalPage: (json['totalPage'] as num).toInt(),
    );

Map<String, dynamic> _$ProductWithPaginationToJson(
        ProductWithPagination instance) =>
    <String, dynamic>{'data': instance.data, 'totalPage': instance.totalPage};
