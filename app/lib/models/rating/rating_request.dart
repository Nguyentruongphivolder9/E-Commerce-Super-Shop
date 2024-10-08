import 'package:image_picker/image_picker.dart';
import 'package:json_annotation/json_annotation.dart';

part '../../generated/rating/rating_request.g.dart';

@JsonSerializable()
class RatingRequest {
  List<XFile>? imageFiles;
  String productId;
  String orderItemId;
  int ratingStar;
  String? productQuality;
  String? trueDescription;
  String? comment;
  RatingRequest({
    this.imageFiles,
    required this.productId,
    required this.orderItemId,
    required this.ratingStar,
    this.productQuality,
    this.trueDescription,
    this.comment,
  });

  factory RatingRequest.fromJson(Map<String, dynamic> json) =>
      _$RatingRequestFromJson(json);

  Map<String, dynamic> toJson() => _$RatingRequestToJson(this);
}
