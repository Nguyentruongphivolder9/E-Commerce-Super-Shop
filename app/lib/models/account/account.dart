import 'package:json_annotation/json_annotation.dart';

@JsonSerializable()
class Account {
  String id;
  String? userName;
  String? avatarUrl;
  String? roleName;
  String? fullName;
  String? email;
  String? phoneNumber;
  String? birthDay;
  String? gender;
  bool? isActive;
  bool? isLoggedOut;
  bool? isEnable;
  bool? isMerege;
  int? userFullNameChanges;
  String? provider;

  Account({
    required this.id,
    this.userName,
    this.avatarUrl,
    this.roleName,
    this.fullName,
    this.email,
    this.phoneNumber,
    this.birthDay,
    this.gender,
    this.isActive,
    this.isLoggedOut,
    this.isEnable,
    this.isMerege,
    this.userFullNameChanges,
    this.provider,
  });

  // Tạo factory để chuyển từ JSON sang đối tượng
  factory Account.fromJson(Map<String, dynamic> json) {
    return Account(
      id: json['id'] as String,
      userName: json['userName'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      roleName: json['roleName'] as String?,
      fullName: json['fullName'] as String?,
      email: json['email'] as String?,
      phoneNumber: json['phoneNumber'] as String?,
      birthDay: json['birthDay'] as String?,
      gender: json['gender'] as String?,
      isActive: json['isActive'] == 1, // Chuyển đổi từ int sang bool
      isLoggedOut: json['isLoggedOut'] == 1,
      isEnable: json['isEnable'] == 1,
      isMerege: json['isMerege'] == 1,
      userFullNameChanges: json['userFullNameChanges'] as int?,
      provider: json['provider'] as String?,
    );
  }

  // Chuyển đổi từ đối tượng sang Map để lưu vào SQLite
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userName': userName,
      'avatarUrl': avatarUrl,
      'roleName': roleName,
      'fullName': fullName,
      'email': email,
      'phoneNumber': phoneNumber,
      'birthDay': birthDay,
      'gender': gender,
      'isActive': isActive == true ? 1 : 0, // Chuyển đổi từ bool sang int
      'isLoggedOut': isLoggedOut == true ? 1 : 0,
      'isEnable': isEnable == true ? 1 : 0,
      'isMerege': isMerege == true ? 1 : 0,
      'userFullNameChanges': userFullNameChanges,
      'provider': provider,
    };
  }

  @override
  String toString() {
    return 'Account(id: $id, userName: $userName, avatarUrl: $avatarUrl, roleName: $roleName, fullName: $fullName, email: $email, phoneNumber: $phoneNumber, birthDay: $birthDay, gender: $gender, isActive: $isActive, isLoggedOut: $isLoggedOut, isEnable: $isEnable, isMerege: $isMerege, userFullNameChanges: $userFullNameChanges, provider: $provider)';
  }
}
