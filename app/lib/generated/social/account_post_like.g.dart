// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/social/account_post_like.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AccountPostLike _$AccountPostLikeFromJson(Map<String, dynamic> json) =>
    AccountPostLike(
      id: json['id'] as String,
      postId: json['postId'] as String,
      accountId: json['accountId'] as String,
      accountName: json['accountName'] as String,
      accountAvatarUrl: json['accountAvatarUrl'] as String,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );

Map<String, dynamic> _$AccountPostLikeToJson(AccountPostLike instance) =>
    <String, dynamic>{
      'id': instance.id,
      'postId': instance.postId,
      'accountId': instance.accountId,
      'accountName': instance.accountName,
      'accountAvatarUrl': instance.accountAvatarUrl,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };
