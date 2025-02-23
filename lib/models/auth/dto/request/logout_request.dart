class LogoutRequest {
  final String email;

  LogoutRequest({required this.email});

  Map<String, dynamic> toJson() => {
    'email': email,
  };
}
