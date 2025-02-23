import 'package:json_annotation/json_annotation.dart';

part '../../generated/account/user_response.g.dart';

@JsonSerializable()
class UserInfoResponse {
  String id;
  String avatarUrl;
  bool isActive;
  String email;
  String? fullName;
  String userName;
  UserInfoResponse({
    required this.id,
    required this.avatarUrl,
    required this.isActive,
    required this.email,
    required this.fullName,
    required this.userName,
  });

  factory UserInfoResponse.fromJson(Map<String, dynamic> json) =>
      _$UserInfoFromJson(json);

  Map<String, dynamic> toJson() => _$UserInfoToJson(this);
}
