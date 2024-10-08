// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/product/product_figure.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductFigure _$ProductFigureFromJson(Map<String, dynamic> json) =>
    ProductFigure(
      ratingStar: (json['ratingStar'] as num).toDouble(),
      sold: (json['sold'] as num).toInt(),
      view: (json['view'] as num).toInt(),
      totalRatings: (json['totalRatings'] as num).toInt(),
      totalStars: (json['totalStars'] as num).toInt(),
      totalFavorites: (json['totalFavorites'] as num).toInt(),
    );

Map<String, dynamic> _$ProductFigureToJson(ProductFigure instance) =>
    <String, dynamic>{
      'ratingStar': instance.ratingStar,
      'sold': instance.sold,
      'view': instance.view,
      'totalRatings': instance.totalRatings,
      'totalStars': instance.totalStars,
      'totalFavorites': instance.totalFavorites,
    };
