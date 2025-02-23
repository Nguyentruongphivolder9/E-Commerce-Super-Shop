// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/auth/device_info.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

DeviceInfo _$DeviceInfoFromJson(Map<String, dynamic> json) => DeviceInfo(
  ipAddress: json['ipAddress'] as String,
  country: json['country'] as String,
  city: json['city'] as String,
  latitude: json['latitude'] as String,
  longitude: json['longitude'] as String,
  region: json['region'] as String,
  regionName: json['regionName'] as String,
  deviceFingerPrint: json['deviceFingerPrint'] as String,
  browserName: json['browserName'] as String,
  deviceType: json['deviceType'] as String,
);

Map<String, dynamic> _$DeviceInfoToJson(DeviceInfo instance) =>
    <String, dynamic>{
      'ipAddress': instance.ipAddress,
      'country': instance.country,
      'city': instance.city,
      'latitude': instance.latitude,
      'longitude': instance.longitude,
      'region': instance.region,
      'regionName': instance.regionName,
      'deviceFingerPrint': instance.deviceFingerPrint,
      'browserName': instance.browserName,
      'deviceType': instance.deviceType,
    };