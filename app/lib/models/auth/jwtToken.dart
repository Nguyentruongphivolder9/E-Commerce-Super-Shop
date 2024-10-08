import 'package:supershop_app/models/account/account.dart';

class JwtResponse {
  String accessToken;
  String refreshToken;
  int expireRefreshToken;
  int expires;
  String secretKey;
  Account account;

  JwtResponse({
    required this.accessToken,
    required this.refreshToken,
    required this.expireRefreshToken,
    required this.expires,
    required this.secretKey,
    required this.account,
  });

  factory JwtResponse.fromJson(Map<String, dynamic> json) {
    return JwtResponse(
      accessToken: json['accessToken'],
      refreshToken: json['refreshToken'],
      expireRefreshToken: json['expireRefreshToken'],
      expires: json['expires'],
      secretKey: json['secretKey'],
      account: Account.fromJson(json['account']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'accessToken': accessToken,
      'refreshToken': refreshToken,
      'expireRefreshToken': expireRefreshToken,
      'expires': expires,
      'secretKey': secretKey,
      'account': account.toJson(),
    };
  }
}
