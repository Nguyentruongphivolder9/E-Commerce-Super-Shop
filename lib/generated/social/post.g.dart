// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/social/post.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Post _$PostFromJson(Map<String, dynamic> json) => Post(
      id: json['id'] as String,
      caption: json['caption'] as String,
      tags: json['tags'] as String? ?? '',
      location: json['location'] as String,
      creatorId: json['creatorId'] as String,
      creatorName: json['creatorName'] as String,
      creatorAvatarUrl: json['creatorAvatarUrl'] as String,
      likes: (json['likes'] as List<dynamic>?)
              ?.map((e) => AccountPostLike.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      postImageResponses: (json['postImageResponses'] as List<dynamic>?)
              ?.map((e) => PostImage.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      createdAt: json['createdAt'] as String? ?? '',
      updatedAt: json['updatedAt'] as String? ?? '',
    );

Map<String, dynamic> _$PostToJson(Post instance) => <String, dynamic>{
      'id': instance.id,
      'caption': instance.caption,
      'tags': instance.tags,
      'location': instance.location,
      'creatorId': instance.creatorId,
      'creatorName': instance.creatorName,
      'creatorAvatarUrl': instance.creatorAvatarUrl,
      'likes': instance.likes.map((e) => e.toJson()).toList(),
      'postImageResponses':
          instance.postImageResponses.map((e) => e.toJson()).toList(),
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };
