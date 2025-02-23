
class LoginFormData {
  final String email;
  final String password;
  final String setUpdate;
  LoginFormData({required this.email, required this.password, required this.setUpdate});

  Map<String, dynamic> toJson() {
    return {
      'email': email,
      'password': password,
      'setUpdate': setUpdate
    };
  }
}