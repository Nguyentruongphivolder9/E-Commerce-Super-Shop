import 'package:json_annotation/json_annotation.dart';

part '../../generated/rating/feedback_image.g.dart';

@JsonSerializable()
class FeedbackImage {
  String id;
  String imageUrl;
  FeedbackImage({required this.id, required this.imageUrl});

  factory FeedbackImage.fromJson(Map<String, dynamic> json) =>
      _$FeedbackImageFromJson(json);
}
