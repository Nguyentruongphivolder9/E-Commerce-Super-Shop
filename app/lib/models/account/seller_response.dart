import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/account/user_response.dart';

part '../../generated/account/seller_response.g.dart';

@JsonSerializable()
class SellerInfoResponse {
  String id;
  int ratingTotal;
  int ratingResponse;
  double ratingStar;
  int productTotal;
  int followerTotal;
  int followingTotal;
  String joinedDate;
  UserInfoResponse account;
  SellerInfoResponse({
    required this.id,
    required this.ratingTotal,
    required this.ratingResponse,
    required this.ratingStar,
    required this.productTotal,
    required this.followerTotal,
    required this.followingTotal,
    required this.joinedDate,
    required this.account,
  });

  factory SellerInfoResponse.fromJson(Map<String, dynamic> json) =>
      _$SellerInfoFromJson(json);

  Map<String, dynamic> toJson() => _$SellerInfoToJson(this);
}
