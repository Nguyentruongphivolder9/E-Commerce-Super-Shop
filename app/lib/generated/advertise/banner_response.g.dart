// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/advertise/banner_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BannerResponse _$BannerResponseFromJson(Map<String, dynamic> json) =>
    BannerResponse(
      advertiseId: json['advertiseId'] as String,
      shopId: json['shopId'] as String,
      advertiseImages: json['advertiseImages'] != null
          ? (json['advertiseImages'] as List<dynamic>)
              .map((e) =>
                  AdvertiseImageResponse.fromJson(e as Map<String, dynamic>))
              .toList()
          : null,
    );
