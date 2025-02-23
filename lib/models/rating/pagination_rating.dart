import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/rating/rating.dart';

part '../../generated/rating/pagination_rating.g.dart';

@JsonSerializable()
class PaginationRating {
  List<Rating>? listRatings;
  int totalPages;
  PaginationRating({this.listRatings, required this.totalPages});

  factory PaginationRating.fromJson(Map<String, dynamic> json) =>
      _$PaginationRatingFromJson(json);
}
