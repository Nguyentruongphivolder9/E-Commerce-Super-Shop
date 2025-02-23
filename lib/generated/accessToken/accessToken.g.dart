// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/auth/accessToken.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AccessToken _$AccessTokenFromJson(Map<String, dynamic> map) => AccessToken(
      id: map['id'] as String,
      token: map['token'],
      refreshToken: map['refreshToken'],
      expiresIn: map['expiresIn'],
      issuedAt: map['issuedAt'],
      expiresAt: map['expiresAt'],
      secretKey: List<int>.from(map['secretKey']),
    );

Map<String, dynamic> _$AccessTokenToJson(AccessToken instance) => <String, dynamic>{
      '_id': instance.id,
      'token': instance.token,
      'refreshToken': instance.refreshToken,
      'expiresIn': instance.expiresIn,
      'issuedAt': instance.issuedAt,
      'expiresAt': instance.expiresAt,
      'secretKey': instance.secretKey,
    };
