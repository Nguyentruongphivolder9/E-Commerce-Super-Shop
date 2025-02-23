import 'package:json_annotation/json_annotation.dart';

part '../../generated/rating/seller_feedback.g.dart';

@JsonSerializable()
class SellerFeedback {
  String id;
  String message;
  String createdAt;
  SellerFeedback({
    required this.id,
    required this.message,
    required this.createdAt,
  });

  factory SellerFeedback.fromJson(Map<String, dynamic> json) =>
      _$SellerFeedbackFromJson(json);
}
