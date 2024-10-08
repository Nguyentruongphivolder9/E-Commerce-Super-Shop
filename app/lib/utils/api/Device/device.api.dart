import 'dart:convert'; // For jsonEncode
import 'package:get/get_connect/http/src/multipart/form_data.dart';
import 'package:http/http.dart' as http;
import 'package:supershop_app/common/form_data/Auth/login_form_data.dart';

import '../../../models/auth/device_info.dart';

const BACKEND_BASE_URL = "http://localhost:8080/api/v1";

class DeviceApi {
  Future<AuthResponse> login(LoginFormData body, DeviceInfo deviceInfo) async {
    final response = await http.post(
      Uri.parse('${BACKEND_BASE_URL}/auth/login'),
      headers: {
        'Content-Type': 'application/json',
        'Device-Finger-Print': deviceInfo.deviceFingerPrint,
        'Device-Info': jsonEncode(deviceInfo.toJson()),
      },
      body: jsonEncode(body.toJson()),
    );

    if (response.statusCode == 200) {
      return AuthResponse.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to login');
    }
  }
}


class AuthResponse {
  // Define fields and constructor
  AuthResponse.fromJson(Map<String, dynamic> json) {
    // Parse JSON into AuthResponse
  }
}
