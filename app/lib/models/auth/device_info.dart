
import 'package:flutter/foundation.dart';
import 'package:json_annotation/json_annotation.dart';

part '../../generated/deviceInfo/device_info.g.dart';

//đối tượng Thông tin thiết bị.
@JsonSerializable()
class DeviceInfo {
  final String ipAddress;
  final String country;
  final String city;
  final String latitude;
  final String longitude;
  final String region;
  final String regionName;
  final String deviceFingerPrint;
  final String browserName;
  final String deviceType;

  DeviceInfo({
    required this.ipAddress,
    required this.country,
    required this.city,
    required this.latitude,
    required this.longitude,
    required this.region,
    required this.regionName,
    required this.deviceFingerPrint,
    required this.browserName,
    required this.deviceType,

  });


  factory DeviceInfo.fromJson(Map<String, dynamic> json) =>
      _$DeviceInfoFromJson(json);

  Map<String, dynamic> toJson() => _$DeviceInfoToJson(this);


}


