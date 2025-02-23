import 'dart:convert';
import 'package:supershop_app/models/auth/jwtToken.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class WebSocketService {
  final String url = 'ws://localhost:8080/ws-endpoint';
  late WebSocketChannel channel;

  void connect() {
    channel = WebSocketChannel.connect(Uri.parse(url));
  }

  void sendJwt(JwtResponse jwtResponse) {
    if (channel != null) {
      final jsonString = jsonEncode(jwtResponse.toJson());
      channel.sink.add(jsonString);
    } else {
      print("Channel is not connected.");
    }
  }

  void disconnect() {
    if (channel != null) {
      channel.sink.close();
    }
  }
}
