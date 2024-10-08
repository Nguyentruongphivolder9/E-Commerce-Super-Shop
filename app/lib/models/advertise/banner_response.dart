import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/advertise/advertise_image_response.dart';

part '../../generated/advertise/banner_response.g.dart';

@JsonSerializable()
class BannerResponse {
  String advertiseId;
  String shopId;
  List<AdvertiseImageResponse>? advertiseImages;
  BannerResponse({
    required this.advertiseId,
    required this.shopId,
    this.advertiseImages,
  });

  factory BannerResponse.fromJson(Map<String, dynamic> json) =>
      _$BannerResponseFromJson(json);
}
