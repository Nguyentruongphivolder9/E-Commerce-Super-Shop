// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/account/user_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

UserInfoResponse _$UserInfoFromJson(Map<String, dynamic> json) {
  return UserInfoResponse(
    id: json['id'] as String,
    avatarUrl: json['avatarUrl'] as String,
    isActive: json['isActive'] as bool,
    email: json['email'] as String,
    fullName: json['fullName'] as String?,
    userName: json['userName'] as String,
  );
}

Map<String, dynamic> _$UserInfoToJson(UserInfoResponse instance) =>
    <String, dynamic>{
      'id': instance.id,
      'avatarUrl': instance.avatarUrl,
      'isActive': instance.isActive,
      'email': instance.email,
      'fullName': instance.fullName,
      'userName': instance.userName,
    };
