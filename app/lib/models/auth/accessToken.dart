import 'package:flutter/foundation.dart';
import 'package:json_annotation/json_annotation.dart';

part '../../generated/accessToken/accessToken.g.dart';

//đối tượng Thông tin thiết bị.
@JsonSerializable()
class AccessToken {
  final String id;
  final String token;
  final String refreshToken;
  final int expiresIn;
  final int issuedAt;
  final int expiresAt;
  final List<int> secretKey;

  AccessToken({
    required this.id,
    required this.token,
    required this.refreshToken,
    required this.expiresIn,
    required this.issuedAt,
    required this.expiresAt,
    required this.secretKey,
  });

  factory AccessToken.fromJson(Map<String, dynamic> json) =>
      _$AccessTokenFromJson(json);

  Map<String, dynamic> toJson() => _$AccessTokenToJson(this);
}
