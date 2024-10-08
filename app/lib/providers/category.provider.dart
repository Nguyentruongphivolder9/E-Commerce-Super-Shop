import 'package:flutter/material.dart';
import 'package:supershop_app/models/category/category.dart';
import 'package:supershop_app/models/success_response.dart';
import 'package:supershop_app/utils/network/http.dart';

class CategoryProvider with ChangeNotifier {
  late final HttpDio _httpDio = HttpDio();
  List<Category> _listAllCategory = [];

  List<Category> get listAllCategory => _listAllCategory;

  CategoryProvider() {
    Future.microtask(() => getListAllCategory());
  }

  Future<void> getListAllCategory() async {
    try {
      final response = await _httpDio.dio.get('categories');
      final successResponse = SuccessResponse<List<Category>>.fromJson(
        response.data,
        (json) => (json as List<dynamic>)
            .map((item) => Category.fromJson(item as Map<String, dynamic>))
            .toList(),
      );

      _listAllCategory = successResponse.body ?? [];
      notifyListeners();
    } catch (e) {
      print("Error fetching list of all categories: $e");
      throw Exception('Failed to load all categories: $e');
    }
  }

  Future<List<Category>> getListRelateCategory(String id) async {
    try {
      final response = await _httpDio.dio.get(
        'categories/$id/list-relate',
      );
      print(response.data);
      final successResponse = SuccessResponse<List<Category>>.fromJson(
        response.data,
        (json) => (json as List<dynamic>)
            .map((item) => Category.fromJson(item as Map<String, dynamic>))
            .toList(),
      );

      return successResponse.body ?? [];
    } catch (e) {
      print("Error fetching list relate category: $e");
      throw Exception('Failed to load relate category: $e');
    }
  }
}
