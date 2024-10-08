// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/rating/pagination_rating.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PaginationRating _$PaginationRatingFromJson(Map<String, dynamic> json) {
  return PaginationRating(
    listRatings: json['listRatings'] != null
        ? (json['listRatings'] as List<dynamic>)
            .map((e) => Rating.fromJson(e as Map<String, dynamic>))
            .toList()
        : null,
    totalPages: json['totalPages'] as int,
  );
}
