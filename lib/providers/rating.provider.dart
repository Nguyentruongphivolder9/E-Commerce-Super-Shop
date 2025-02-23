import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:mime/mime.dart';
import 'package:supershop_app/models/params_config.dart';
import 'package:supershop_app/models/rating/pagination_rating.dart';
import 'package:supershop_app/models/rating/rating_figure.dart';
import 'package:supershop_app/models/rating/rating_request.dart';
import 'package:supershop_app/models/success_response.dart';
import 'package:supershop_app/utils/network/http.dart';
import 'package:http/http.dart' as http;

class RatingProvider with ChangeNotifier {
  late final HttpDio _httpDio = HttpDio();

  Future<RatingFigure?> getRatingFigure(String productId) async {
    try {
      final response =
          await _httpDio.dio.get('ratings/product/$productId/figure');

      final successResponse = SuccessResponse<RatingFigure>.fromJson(
        response.data,
        (json) => RatingFigure.fromJson(json as Map<String, dynamic>),
      );

      return successResponse.body;
    } catch (e) {
      print("Error fetching list ratings: $e");
      throw Exception('Failed to load ratings: $e');
    }
  }

  Future<PaginationRating?> getListRatings(
      String productId, ParamsConfig params) async {
    try {
      final response = await _httpDio.dio.get(
        'ratings/product/$productId',
        queryParameters: params.toJson(),
      );
      final successResponse = SuccessResponse<PaginationRating>.fromJson(
        response.data,
        (json) => PaginationRating.fromJson(json as Map<String, dynamic>),
      );

      return successResponse.body;
    } catch (e) {
      print("Error fetching list ratings: $e");
      throw Exception('Failed to load ratings: $e');
    }
  }

  Future<void> createRating(RatingRequest formRequest) async {
    try {
      FormData formData = FormData.fromMap({
        'productId': formRequest.productId,
        'orderItemId': formRequest.orderItemId,
        'ratingStar': formRequest.ratingStar,
        'comment': formRequest.comment,
        'productQuality': formRequest.productQuality,
        'trueDescription': formRequest.trueDescription,
        'imageFiles': [
          for (var file in formRequest.imageFiles ?? [])
            await MultipartFile.fromFile(file.path, filename: file.name),
        ],
      });

      await _httpDio.dio.post(
        'ratings',
        data: formData,
        options: Options(
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        ),
      );
    } catch (e) {
      print("Create rating error: $e");
    }
  }
}
