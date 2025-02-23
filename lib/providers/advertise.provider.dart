import 'package:flutter/material.dart';
import 'package:supershop_app/models/advertise/banner_response.dart';
import 'package:supershop_app/utils/network/http.dart';
import 'package:supershop_app/models/success_response.dart';

class AdvertiseProvider with ChangeNotifier {
  late final HttpDio _httpDio = HttpDio();

  List<BannerResponse> _listAllAdvertise = [];

  List<BannerResponse> get listAllAdvertise => _listAllAdvertise;

  Future<void> fetchListAllAdvertise() async {
    try {
      final response = await _httpDio.dio.get('advertises/active-images');
      final successResponse = SuccessResponse<List<BannerResponse>>.fromJson(
        response.data,
        (json) => (json as List<dynamic>)
            .map(
                (item) => BannerResponse.fromJson(item as Map<String, dynamic>))
            .toList(),
      );

      _listAllAdvertise = successResponse.body ?? [];
      notifyListeners();
    } catch (e) {
      print("Error fetching list of all advertisements: $e");
      throw Exception('Failed to load all advertisements: $e');
    }
  }
}
