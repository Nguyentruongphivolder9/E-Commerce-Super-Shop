import 'package:json_annotation/json_annotation.dart';

part '../../generated/advertise/advertise_image_response.g.dart';

@JsonSerializable()
class AdvertiseImageResponse {
  String id;
  String imageUrl;
  AdvertiseImageResponse({
    required this.id,
    required this.imageUrl,
  });

  factory AdvertiseImageResponse.fromJson(Map<String, dynamic> json) =>
      _$AdvertiseImageResponseFromJson(json);
}
