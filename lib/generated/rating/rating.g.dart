// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/rating/rating.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Rating _$RatingFromJson(Map<String, dynamic> json) {
  return Rating(
    id: json['id'] as String,
    productId: json['productId'] as String,
    ratingStar: (json['ratingStar'] as num).toInt(),
    productQuality: (json['productQuality'] != null)
        ? (json['productQuality'] as String)
        : null,
    trueDescription: (json['trueDescription'] != null)
        ? (json['trueDescription'] as String)
        : null,
    comment: (json['comment'] != 'null') ? (json['comment'] as String) : null,
    feedbackImages: json['feedbackImages'] != null
        ? (json['feedbackImages'] as List<dynamic>)
            .map((e) => FeedbackImage.fromJson(e as Map<String, dynamic>))
            .toList()
        : null,
    account: UserInfoResponse.fromJson(json['account'] as Map<String, dynamic>),
    isVoteUseFull: json['isVoteUseFull'] as bool,
    countVote: (json['countVote'] as num).toInt(),
    variantName:
        (json['variantName'] != null) ? (json['variantName'] as String) : null,
    sellerFeedback: json['sellerFeedback'] != null
        ? SellerFeedback.fromJson(
            json['sellerFeedback'] as Map<String, dynamic>)
        : null,
    createdAt: json['createdAt'] as String,
    updatedAt: json['updatedAt'] as String,
  );
}
