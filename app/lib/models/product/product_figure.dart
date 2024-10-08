import 'package:json_annotation/json_annotation.dart';

part '../../generated/product/product_figure.g.dart';

@JsonSerializable()
class ProductFigure {
  final double ratingStar;
  final int sold;
  final int view;
  final int totalRatings;
  final int totalStars;
  final int totalFavorites;

  ProductFigure({
    required this.ratingStar,
    required this.sold,
    required this.view,
    required this.totalRatings,
    required this.totalStars,
    required this.totalFavorites,
  });

  factory ProductFigure.fromJson(Map<String, dynamic> json) =>
      _$ProductFigureFromJson(json);

  Map<String, dynamic> toJson() => _$ProductFigureToJson(this);
}
