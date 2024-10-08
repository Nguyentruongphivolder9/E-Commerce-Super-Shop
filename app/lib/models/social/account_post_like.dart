import 'package:json_annotation/json_annotation.dart';

part '../../generated/social/account_post_like.g.dart';

@JsonSerializable()
class AccountPostLike {
  late String id;
  late String postId;
  late String accountId;
  late String accountName;
  late String accountAvatarUrl;

  late String createdAt;
  late String updatedAt;

  AccountPostLike({
    required this.id,
    required this.postId,
    required this.accountId,
    required this.accountName,
    required this.accountAvatarUrl,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AccountPostLike.fromJson(Map<String, dynamic> json) =>
      _$AccountPostLikeFromJson(json);

  Map<String, dynamic> toJson() => _$AccountPostLikeToJson(this);
}
