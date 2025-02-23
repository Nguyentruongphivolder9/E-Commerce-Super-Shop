import 'dart:ffi';

import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/account/user_response.dart';
import 'package:supershop_app/models/rating/feedback_image.dart';
import 'package:supershop_app/models/rating/seller_feedback.dart';

part '../../generated/rating/rating.g.dart';

@JsonSerializable()
class Rating {
  String id;
  String productId;
  int ratingStar;
  String? productQuality;
  String? trueDescription;
  String? comment;
  List<FeedbackImage>? feedbackImages;
  UserInfoResponse account;
  bool isVoteUseFull;
  int countVote;
  String? variantName;
  SellerFeedback? sellerFeedback;
  String createdAt;
  String updatedAt;
  Rating({
    required this.id,
    required this.productId,
    required this.ratingStar,
    this.productQuality,
    this.trueDescription,
    this.comment,
    this.feedbackImages,
    required this.account,
    required this.isVoteUseFull,
    required this.countVote,
    this.variantName,
    this.sellerFeedback,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Rating.fromJson(Map<String, dynamic> json) => _$RatingFromJson(json);
}
