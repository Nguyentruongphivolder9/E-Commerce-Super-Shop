// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/product/shop_detail_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ShopDetailResponse _$ShopDetailFromJson(Map<String, dynamic> json) =>
    ShopDetailResponse(
      shopInfo:
          SellerInfoResponse.fromJson(json['shopInfo'] as Map<String, dynamic>),
      topSales: json['topSales'] != null
          ? (json['topSales'] as List<dynamic>)
              .map((e) => Product.fromJson(e as Map<String, dynamic>))
              .toList()
          : null,
      categoryOfShop: json['categoryOfShop'] != null
          ? (json['categoryOfShop'] as List<dynamic>)
              .map((e) => CategoryOfShop.fromJson(e as Map<String, dynamic>))
              .toList()
          : null,
      categoryOfShopDecoration: json['categoryOfShopDecoration'] != null
          ? (json['categoryOfShopDecoration'] as List<dynamic>)
              .map((e) =>
                  CategoryOfShopDecoration.fromJson(e as Map<String, dynamic>))
              .toList()
          : null,
    );
