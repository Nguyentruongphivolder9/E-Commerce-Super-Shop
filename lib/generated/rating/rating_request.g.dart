// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/rating/rating_request.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

RatingRequest _$RatingRequestFromJson(Map<String, dynamic> json) {
  return RatingRequest(
    imageFiles: (json['imageFiles'] as List<dynamic>?)
        ?.map((e) => XFile(e as String)) // Convert the string to XFile
        .toList(),
    productId: json['productId'] as String,
    orderItemId: json['orderItemId'] as String,
    ratingStar: json['ratingStar'] as int,
    productQuality: json['productQuality'] as String?,
    trueDescription: json['trueDescription'] as String?,
    comment: json['comment'] as String?,
  );
}

Map<String, dynamic> _$RatingRequestToJson(RatingRequest instance) =>
    <String, dynamic>{
      'imageFiles': instance.imageFiles?.map((e) => e.path).toList(),
      'productId': instance.productId,
      'orderItemId': instance.orderItemId,
      'ratingStar': instance.ratingStar,
      'productQuality': instance.productQuality,
      'trueDescription': instance.trueDescription,
      'comment': instance.comment,
    };
