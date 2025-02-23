import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/social/account_post_like.dart';
import 'package:supershop_app/models/social/post_image.dart';

part '../../generated/social/post.g.dart';

@JsonSerializable()
class Post {
  late String id;
  late String caption;
  late String? tags;
  late String location;
  late String creatorId;
  late String creatorName;
  late String creatorAvatarUrl;
  late List<AccountPostLike> likes;
  late List<PostImage> postImageResponses;

  late String? createdAt;
  late String? updatedAt;

  Post({
    required this.id,
    required this.caption,
    this.tags,
    required this.location,
    required this.creatorId,
    required this.creatorName,
    required this.creatorAvatarUrl,
    required this.likes,
    required this.postImageResponses,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Post.fromJson(Map<String, dynamic> json) => _$PostFromJson(json);

  Map<String, dynamic> toJson() => _$PostToJson(this);
}
