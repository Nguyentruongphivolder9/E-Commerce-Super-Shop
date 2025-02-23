import 'dart:convert';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/cupertino.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supershop_app/models/auth/device_info.dart';
import 'package:http/http.dart' as http;
import 'package:supershop_app/utils/database/database_helper.dart';

class DeviceProvider with ChangeNotifier {
  final DatabaseHelper _dbHelper = DatabaseHelper();
  DeviceInfo? _deviceInfo;
  DeviceInfo? get deviceInfo => _deviceInfo;

  Future<DeviceInfo?> fetchDeviceInfo() async {
    try {
      // Lấy địa chỉ IP
      final ipResponse = await http.get(Uri.parse('https://api.ipify.org?format=json'));
      final ipData = jsonDecode(ipResponse.body);
      final ipAddress = ipData['ip'];

      // Lấy thông tin vị trí từ IP
      final locationResponse = await http.get(Uri.parse('http://ip-api.com/json/$ipAddress'));
      final locationData = jsonDecode(locationResponse.body);

      // Lấy thông tin thiết bị
      DeviceInfoPlugin deviceInfoPlugin = DeviceInfoPlugin();
      String deviceId = '';
      SharedPreferences prefs = await SharedPreferences.getInstance();

      if (prefs.containsKey('deviceFingerPrintId')) {
        deviceId = prefs.getString('deviceFingerPrintId')!;
      } else {
        final deviceInfo = await deviceInfoPlugin.deviceInfo;
        deviceId = deviceInfo.hashCode.toString();
        prefs.setString('deviceFingerPrintId', deviceId);
      }

      final androidInfo = await deviceInfoPlugin.androidInfo;
      final deviceType = 'Android';
      final browserName = androidInfo.model ?? 'Unknown';

      DeviceInfo currentDevice = DeviceInfo(
        ipAddress: locationData['query'] ?? 'Unknown',
        country: locationData['country'] ?? 'Unknown',
        city: locationData['city'] ?? 'Unknown',
        latitude: locationData['lat']?.toString() ?? 'Unknown',
        longitude: locationData['lon']?.toString() ?? 'Unknown',
        region: locationData['region'] ?? 'Unknown',
        regionName: locationData['regionName'] ?? 'Unknown',
        deviceFingerPrint: deviceId,
        browserName: browserName,
        deviceType: deviceType,
      );

      DeviceInfo? deviceFromDB = await _dbHelper.getDeviceFromDb();

      if (deviceFromDB == null || _isDifferentDevice(deviceFromDB, currentDevice)) {
        await _dbHelper.saveDeviceInfo(currentDevice);
        _deviceInfo = currentDevice;
      } else {
        _deviceInfo = deviceFromDB;
      }

      return _deviceInfo;
    } catch (e) {
      print('Failed to fetch device info: $e');
      return null;
    }
  }

  bool _isDifferentDevice(DeviceInfo storedDevice, DeviceInfo currentDevice) {
    // So sánh các trường quan trọng để xác định thiết bị khác nhau
    return storedDevice.deviceFingerPrint != currentDevice.deviceFingerPrint ||
        storedDevice.ipAddress != currentDevice.ipAddress ||
        storedDevice.country != currentDevice.country ||
        storedDevice.city != currentDevice.city;
  }
}
