import 'dart:convert';

Map<String, dynamic> decodeJwtToken(String token) {
  try {
    final parts = token.split('.');
    if (parts.length != 3) {
      throw Exception('Invalid JWT token format.');
    }

    final payload = base64Url.normalize(parts[1]);
    final decodedJson = utf8.decode(base64Url.decode(payload));

    return jsonDecode(decodedJson) as Map<String, dynamic>;
  } catch (e) {
    print('Error decoding JWT token: $e');
    throw Exception('Failed to decode JWT token');
  }
}
