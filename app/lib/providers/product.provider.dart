import 'dart:math';

import 'package:flutter/cupertino.dart';
import 'package:supershop_app/models/params_config.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:supershop_app/models/product/product_detail.dart';
import 'package:supershop_app/models/success_response.dart';
import 'package:supershop_app/utils/network/http.dart';

class ProductProvider with ChangeNotifier {
  late final HttpDio _httpDio = HttpDio();
  final List<Product> _listProductRecommendation = [];
  List<Product> get listProductRecommendation => _listProductRecommendation;
  final List<Product> _listProductInterest = [];
  List<Product> get listProductInterest => _listProductInterest;

  ProductDetailForUser? _product;
  ProductDetailForUser? get product => _product;

  ProductProvider() {
    Future.microtask(() => getListProductsInterest());
    Future.microtask(
        () => {getListProductsRecommendation(ParamsConfig(page: "1"))});
  }

  Future<void> getListProductsRecommendation(ParamsConfig params) async {
    try {
      final response = await _httpDio.dio.get(
        'mobile/products/recommendation',
        queryParameters: params.toJson(),
      );
      final successResponse = SuccessResponse<List<Product>>.fromJson(
        response.data,
        (json) => (json as List<dynamic>)
            .map((item) => Product.fromJson(item as Map<String, dynamic>))
            .toList(),
      );

      if (params.page == null || params.page == '1') {
        _listProductRecommendation.clear();
      }
      _listProductRecommendation.addAll(successResponse.body ?? []);
      notifyListeners();
    } catch (e) {
      print("Error fetching product recommendations: $e");
      throw Exception('Failed to load products: $e');
    }
  }

  Future<void> getProductDetail(String productId, String shopId) async {
    try {
      final response = await _httpDio.dio.get(
        'products/$productId/shop/$shopId',
      );
      final successResponse = SuccessResponse<ProductDetailForUser>.fromJson(
        response.data,
        (json) => ProductDetailForUser.fromJson(json as Map<String, dynamic>),
      );

      _product = successResponse.body;
      notifyListeners();
    } catch (e) {
      print("Error fetching product: $e");
      throw Exception('Failed to load product: $e');
    }
  }

  Future<List<Product>> getListProductsFilter(ParamsConfig params) async {
    try {
      final response = await _httpDio.dio.get(
        'mobile/products/list-for-user',
        queryParameters: params.toJson(),
      );
      final successResponse = SuccessResponse<List<Product>>.fromJson(
        response.data,
        (json) => (json as List<dynamic>)
            .map((item) => Product.fromJson(item as Map<String, dynamic>))
            .toList(),
      );

      return successResponse.body ?? [];
    } catch (e) {
      print("Error fetching product recommendations: $e");
      throw Exception('Failed to load products: $e');
    }
  }

  Future<void> getListProductsInterest() async {
    try {
      final response = await _httpDio.dio.get('products-interest');
      final successResponse = SuccessResponse<List<Product>>.fromJson(
        response.data,
        (json) => (json as List<dynamic>)
            .map((item) => Product.fromJson(item as Map<String, dynamic>))
            .toList(),
      );

      _listProductInterest.addAll(successResponse.body ?? []);
      notifyListeners();
    } catch (e) {
      print("Error fetching product interest: $e");
      throw Exception('Failed to load products: $e');
    }
  }
}
