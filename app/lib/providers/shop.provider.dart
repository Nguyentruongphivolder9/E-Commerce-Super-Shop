import 'package:flutter/material.dart';
import 'package:supershop_app/models/params_config.dart';
import 'package:supershop_app/models/product/product_pagination.dart';
import 'package:supershop_app/models/product/shop_detail_response.dart';
import 'package:supershop_app/models/success_response.dart';
import 'package:supershop_app/utils/network/http.dart';

class ShopProvider with ChangeNotifier {
  late final HttpDio _httpDio = HttpDio();

  Future<ShopDetailResponse?> getShopDetail(String shopId) async {
    try {
      final response = await _httpDio.dio.get(
        'shop-detail/$shopId',
      );
      final successResponse = SuccessResponse<ShopDetailResponse>.fromJson(
        response.data,
        (json) => ShopDetailResponse.fromJson(json as Map<String, dynamic>),
      );

      return successResponse.body;
    } catch (e) {
      print("Error fetching shop detail: $e");
      throw Exception('Failed to load product: $e');
    }
  }

  Future<ProductPagination?> getListProductsFilter(
      String shopId, ParamsConfig params) async {
    try {
      final response = await _httpDio.dio.get(
        'shop-detail/$shopId/list-products',
        queryParameters: params.toJson(),
      );
      final successResponse = SuccessResponse<ProductPagination>.fromJson(
        response.data,
        (json) => ProductPagination.fromJson(json as Map<String, dynamic>),
      );

      return successResponse.body;
    } catch (e) {
      print("Error fetching list products: $e");
      throw Exception('Failed to load products: $e');
    }
  }
}
