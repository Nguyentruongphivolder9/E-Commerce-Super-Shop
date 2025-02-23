import 'package:json_annotation/json_annotation.dart';

part '../../generated/social/post_image.g.dart';

@JsonSerializable()
class PostImage {
  late String id;
  late String imageUrl;
  late String postId;

  PostImage({
    required this.id,
    required this.imageUrl,
    required this.postId,
  });

  factory PostImage.fromJson(Map<String, dynamic> json) =>
      _$PostImageFromJson(json);

  Map<String, dynamic> toJson() => _$PostImageToJson(this);
}
