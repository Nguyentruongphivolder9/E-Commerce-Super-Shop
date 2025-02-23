import 'package:supershop_app/models/account/account.dart';

class AuthResponseBody {
  final String accessToken;
  final String refreshToken;
  final int expireRefreshToken;
  final int expires;
  final String secretKey;

  AuthResponseBody({
    required this.accessToken,
    required this.refreshToken,
    required this.expireRefreshToken,
    required this.expires,
    required this.secretKey,
  });

  factory AuthResponseBody.fromJson(Map<String, dynamic> json) {
    return AuthResponseBody(
      accessToken: json['accessToken'],
      refreshToken: json['refreshToken'],
      expireRefreshToken: json['expireRefreshToken'],
      expires: json['expires'],
      secretKey: json['secretKey'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'accessToken': accessToken,
      'refreshToken': refreshToken,
      'expireRefreshToken': expireRefreshToken,
      'expires': expires,
      'secretKey': secretKey,
    };
  }
}
