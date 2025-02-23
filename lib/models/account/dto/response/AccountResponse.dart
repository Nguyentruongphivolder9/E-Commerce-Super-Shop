import 'package:supershop_app/models/account/account.dart';

class AccountResponse {
  final String id;
  final String createdAt;
  final String updatedAt;
  final String userName;
  final String avatarUrl;
  final String? roleName;
  final String? fullName;
  final String email;
  final String? phoneNumber;
  final String? birthDay;
  final String gender;
  final bool isActive;
  final bool isLoggedOut;
  final bool isEnable;
  final bool isMerege;
  final int userFullNameChanges;
  final String provider;

  AccountResponse({
    required this.id,
    required this.createdAt,
    required this.updatedAt,
    required this.userName,
    required this.avatarUrl,
    this.roleName,
    this.fullName,
    required this.email,
    this.phoneNumber,
    this.birthDay,
    required this.gender,
    required this.isActive,
    required this.isLoggedOut,
    required this.isEnable,
    required this.isMerege,
    required this.userFullNameChanges,
    required this.provider,
  });

  factory AccountResponse.fromJson(Map<String, dynamic> json) {
    return AccountResponse(
      id: json['id'] as String,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
      userName: json['userName'] as String,
      avatarUrl: json['avatarUrl'] as String,
      roleName: json['roleName'] as String?,
      fullName: json['fullName'] as String?,
      email: json['email'] as String,
      phoneNumber: json['phoneNumber'] as String?,
      birthDay: json['birthDay'] as String?,
      gender: json['gender'] as String,
      isActive: json['isActive'] as bool,
      isLoggedOut: json['isLoggedOut'] as bool,
      isEnable: json['isEnable'] as bool,
      isMerege: json['isMerege'] as bool,
      userFullNameChanges: json['userFullNameChanges'] as int,
      provider: json['provider'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
      'userName': userName,
      'avatarUrl': avatarUrl,
      'roleName': roleName,
      'fullName': fullName,
      'email': email,
      'phoneNumber': phoneNumber,
      'birthDay': birthDay,
      'gender': gender,
      'isActive': isActive,
      'isLoggedOut': isLoggedOut,
      'isEnable': isEnable,
      'isMerege': isMerege,
      'userFullNameChanges': userFullNameChanges,
      'provider': provider,
    };
  }
}
