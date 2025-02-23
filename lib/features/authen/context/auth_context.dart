import 'package:flutter/material.dart';
import 'package:supershop_app/models/auth/device_info.dart';
import 'package:provider/provider.dart';

import '../../../providers/deviceInfo.provider.dart';

class AuthContext extends ChangeNotifier {
  DeviceInfo? _deviceInfo;
  DeviceInfo? get device => _deviceInfo;

  Future<void> _initializeContext(BuildContext context) async {
    final deviceProvider = Provider.of<DeviceProvider>(context, listen: false);
    _deviceInfo = await deviceProvider.fetchDeviceInfo();
    notifyListeners();
  }

  void initialize(BuildContext context) {
    _initializeContext(context);
  }
}
