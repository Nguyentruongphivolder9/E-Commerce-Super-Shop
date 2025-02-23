import 'package:shared_preferences/shared_preferences.dart';
import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import 'package:supershop_app/models/account/account.dart';
import 'package:supershop_app/models/auth/device_info.dart';

import '../../models/auth/accessToken.dart';
import 'create_table_query.dart';

class DatabaseHelper {
  static final DatabaseHelper _instance = DatabaseHelper._internal();

  factory DatabaseHelper() => _instance;
  static Database? _database;

  DatabaseHelper._internal();

  Future<Database> get database async {
    if (_database != null) return _database!;
    {
      _database = await _initDatabase();
      return _database!;
    }
  }

  Future<Database> _initDatabase() async {
    String path = join(await getDatabasesPath(), 'super_shop.db');
    return await openDatabase(
      path,
      version: 4,
      onCreate: _createDatabase,
    );
  }

  Future<void> deleteAndRecreateDatabase() async {
    await _deleteDatabase();
    await _initDatabase();
  }

  Future<void> _deleteDatabase() async {
    String path = join(await getDatabasesPath(), 'super_shop.db');
    await deleteDatabase(path);
  }

  void _createDatabase(Database db, int version) async {
    await db.execute(createUserTable);     // Tạo bảng Account
    await db.execute(createDeviceTable);   // Tạo bảng Device
    await db.execute(createAddressTable);  // Tạo bảng Address
    await db.execute(createAccessTokenTable); // Tạo bảng AccessToken
  }

  // Các phương thức cho Account.
  Future<Account?> getAccountFromDb() async {
    final db = await database;
    final List<Map<String, dynamic>> accountJson = await db.query('account', limit: 1);
    print("Account Json from db ${accountJson}");
    if (accountJson.isNotEmpty) {
      return Account.fromJson(accountJson.first);
    }
    return null;
  }

  Future<void> saveAccount(Account account) async {
    final db = await database;
    Map<String, dynamic> accountMap = account.toJson();

    accountMap['isActive'] = account.isActive == true ? 1 : 0;
    accountMap['isLoggedOut'] = account.isLoggedOut == true ? 1 : 0;
    accountMap['isEnable'] = account.isEnable == true ? 1 : 0;
    accountMap['isMerege'] = account.isMerege == true ? 1 : 0;

    await db.insert(
      'account',
      accountMap,
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  // Thêm hàm xóa Account
  Future<void> deleteAccount() async {
    final db = await database;
    await db.delete('account');
  }

  // Các phương thức cho Device.
  Future<DeviceInfo?> getDeviceFromDb() async {
    final db = await database;
    final List<Map<String, dynamic>> deviceInfoJson = await db.query("device", limit: 1);
    if (deviceInfoJson.isNotEmpty) {
      return DeviceInfo.fromJson(deviceInfoJson.first);
    }
    return null;
  }

  Future<void> saveDeviceInfo(DeviceInfo deviceInfo) async {
    final db = await database;
    await db.insert(
      'device',
      deviceInfo.toJson(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  Future<void> updateDeviceInfo(DeviceInfo deviceInfo) async {
    final db = await database;
    await db.update(
      'device',
      deviceInfo.toJson(),
      where: 'deviceFingerPrint = ?',
      whereArgs: [deviceInfo.deviceFingerPrint],
    );
  }

  // Các phương thức cho AccessToken.
  Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('accessToken', token);
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('accessToken');
  }

  // Thêm hàm xóa AccessToken từ SharedPreferences
  Future<void> deleteToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('accessToken');
  }
}
