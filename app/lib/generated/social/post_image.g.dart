// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/social/post_image.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PostImage _$PostImageFromJson(Map<String, dynamic> json) => PostImage(
      id: json['id'] as String,
      imageUrl: json['imageUrl'] as String,
      postId: json['postId'] as String,
    );

Map<String, dynamic> _$PostImageToJson(PostImage instance) => <String, dynamic>{
      'id': instance.id,
      'imageUrl': instance.imageUrl,
      'postId': instance.postId,
    };
