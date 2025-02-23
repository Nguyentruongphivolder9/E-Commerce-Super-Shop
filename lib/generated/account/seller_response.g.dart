// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/account/seller_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SellerInfoResponse _$SellerInfoFromJson(Map<String, dynamic> json) {
  return SellerInfoResponse(
    id: json['id'] as String,
    ratingTotal: json['ratingTotal'] as int,
    ratingResponse: json['ratingResponse'] as int,
    ratingStar: (json['ratingStar'] as num).toDouble(),
    productTotal: json['productTotal'] as int,
    followerTotal: json['followerTotal'] as int,
    followingTotal: json['followingTotal'] as int,
    joinedDate: json['joinedDate'] as String,
    account: UserInfoResponse.fromJson(json['account'] as Map<String, dynamic>),
  );
}

Map<String, dynamic> _$SellerInfoToJson(SellerInfoResponse instance) =>
    <String, dynamic>{
      'id': instance.id,
      'ratingTotal': instance.ratingTotal,
      'ratingResponse': instance.ratingResponse,
      'ratingStar': instance.ratingStar,
      'productTotal': instance.productTotal,
      'followerTotal': instance.followerTotal,
      'followingTotal': instance.followingTotal,
      'joinedDate': instance.joinedDate,
      'account': instance.account.toJson(),
    };
