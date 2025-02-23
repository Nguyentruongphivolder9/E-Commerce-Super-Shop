// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../../models/social/formdata/create_post_data.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CreatePostData _$CreatePostDataFromJson(Map<String, dynamic> json) {
  return CreatePostData(
    caption: json['caption'] as String,
    creatorId: json['creatorId'] as String,
    location: json['location'] as String,
    tags: json['tags'] as String? ?? '',
    postImages: (json['postImages'] as List<dynamic>?)
            ?.map((e) => File(e as String))
            .toList() ??
        [],
  );
}

Map<String, dynamic> _$CreatePostDataToJson(CreatePostData instance) =>
    <String, dynamic>{
      'caption': instance.caption,
      'creatorId': instance.creatorId,
      'location': instance.location,
      'tags': instance.tags,
      'postImages': instance.postImages?.map((e) => e.path).toList(),
    };
