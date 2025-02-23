import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/common/widgets/line_container.dart';
import 'package:supershop_app/models/auth/accessToken.dart';
import 'package:supershop_app/models/auth/device_info.dart';
import 'package:supershop_app/providers/deviceInfo.provider.dart';
import 'package:supershop_app/utils/api/Authentication/auth.api.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';
import 'package:supershop_app/utils/converts/image.dart';
import 'package:supershop_app/utils/database/database_helper.dart';
import '../../../models/account/account.dart';
import '../../../routes/routes.dart';
import '../context/profile_context.dart';

class ProfileScreen extends StatefulWidget {
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  Future<void>? _initDataFuture;
  DeviceInfo? deviceInfo;

  @override
  void initState() {
    super.initState();
    _initializeData();
  }

  Future<void> _initializeData() async {
    final profileContext = Provider.of<ProfileContext>(context, listen: false);
    final deviceProvider = Provider.of<DeviceProvider>(context, listen: false);
    deviceInfo = await deviceProvider.fetchDeviceInfo();
    _initDataFuture = profileContext.initializeDetails(context);
  }

  Future _refresh() async {}

  @override
  Widget build(BuildContext context) {
    print(deviceInfo);
    final profileContext = Provider.of<ProfileContext>(context);
    final details = profileContext.details;
    final account = profileContext.account;
    return Scaffold(
      backgroundColor: Colors.black12,
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              child: Text('Header'),
              decoration: BoxDecoration(
                color: Colors.blue,
              ),
            ),
            ListTile(
              title: Text('Item 1'),
              onTap: () {
                // Đóng drawer
                Navigator.pop(context);
              },
            ),
            ListTile(
              title: Text('Item 2'),
              onTap: () {
                // Đóng drawer
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
      body: FutureBuilder(
        future: _initDataFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          return RefreshIndicator(
            onRefresh: _refresh,
            child: Container(
              decoration: const BoxDecoration(color: ColorsString.white),
              child: ListView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: EdgeInsets.zero,
                children: [
                  if (account != null) _buildHeader(account) else _buildNoAccountHeader(),
                  ...details.map((detail) => detail).toList(),
                  Container(
                    decoration: const BoxDecoration(color: ColorsString.white),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    child: Column(
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: Row(
                            children: [
                              Expanded(
                                child: Container(
                                  height: 1,
                                  color: ColorsString.black,
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Text(
                                'You May Also Like',
                                style: TextStyle(
                                  color: ColorsString.black,
                                  fontSize: Sizes.fontSizeSm,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Container(
                                  height: 1,
                                  color: ColorsString.black,
                                ),
                              ),
                            ],
                          ),
                        ),
                        // const ListProduct()
                      ],
                    ),
                  )
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildHeader(Account account) {
    AuthApi _authApi = AuthApi();
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [ColorsString.primary, ColorsString.primary.withOpacity(0.5)],
        ),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 15),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back),
                  color: Colors.blueAccent,
                  onPressed: () {},
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.message_rounded),
                  color: Colors.blueAccent,
                  onPressed: () {},
                ),
                IconButton(
                  icon: const Icon(Icons.settings),
                  color: Colors.blueAccent,
                  onPressed: () {
                    Scaffold.of(context).openDrawer();
                  },
                ),
              ],
            ),
          ),
          Row(
            children: [
              CircleAvatar(
                radius: 24,
                backgroundImage: NetworkImage(
                  generateURLAvatar(account.avatarUrl!),
                ),
                backgroundColor: Colors.grey[200],
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      account.userName!,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Text(
                          'Followers 5 | ',
                          style: const TextStyle(
                            fontSize: 10,
                            color: Colors.black54,
                          ),
                        ),
                        Text(
                          'Followings 120',
                          style: const TextStyle(
                            fontSize: 10,
                            color: Colors.black54,
                          ),
                        ),
                      ],
                    )
                  ],
                ),
              ),
              TextButton(
                onPressed: () async {
                  if (deviceInfo != null) {
                    await _authApi.logout(deviceInfo!);
                  } else {
                    print("Device info is not available.");
                  }
                },
                style: TextButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  shape: const RoundedRectangleBorder(
                    borderRadius: BorderRadius.zero,
                  ),
                ),
                child: const Text("Logout"),
              )
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildNoAccountHeader() {
    final DatabaseHelper _database = DatabaseHelper();
    final AuthApi _authApi = AuthApi();
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [ColorsString.primary.withOpacity(0.8), ColorsString.primary.withOpacity(0.5)],
        ),
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          IconButton(
            icon: const Icon(Icons.arrow_back),
            color: Colors.blueAccent,
            onPressed: () async {
              DeviceInfo? device = await _database.getDeviceFromDb();
              await _authApi.logout(device!);
            },
          ),
          Padding(
            padding: const EdgeInsets.only(top: 15, bottom: 10),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back),
                  color: Colors.blueAccent,
                  onPressed: () {
                    // Navigator.of(context).pop();
                  },
                ),
                const Spacer(),
                IconButton(
                  icon: const Icon(Icons.settings),
                  color: Colors.blueAccent,
                  onPressed: () {},
                ),
                IconButton(
                  icon: const Icon(Icons.message_rounded),
                  color: Colors.blueAccent,
                  onPressed: () async {
                    String? accessToken = await _database.getToken();
                    Account? account = await _database.getAccountFromDb();
                    DeviceInfo? deviceInfo = await _database.getDeviceFromDb();
                    if (accessToken == null) {
                      print("No accessToken found");
                    } else {
                      print("AccessToken nek $accessToken");
                    }

                    if (account == null) {
                      print("No account found");
                    } else {
                      print("account nek ${account.toJson()}");
                    }

                    if (deviceInfo == null) {
                      print("No Device found");
                    } else {
                      print("device nek ${deviceInfo.toJson()}");
                    }
                  },
                ),
              ],
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // CircleAvatar
              CircleAvatar(
                radius: 24,
                backgroundImage: const NetworkImage(
                  'https://t3.ftcdn.net/jpg/00/64/67/52/360_F_64675209_7ve2XQANuzuHjMZXP3aIYIpsDKEbF5dD.jpg',
                ),
                backgroundColor: Colors.grey[200],
              ),
              // Hàng chứa hai nút
              Row(
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    child: TextButton(
                      onPressed: () {
                        Get.toNamed(AppPage.getLogin());
                      },
                      style: TextButton.styleFrom(
                        backgroundColor: Colors.blueAccent,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                      child: const Text('Log In'),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10.0),
                    child: TextButton(
                      onPressed: () {
                        Get.toNamed(AppPage.getLogin());
                      },
                      style: TextButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: Colors.blueAccent,
                        padding: const EdgeInsets.symmetric(horizontal: 8),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(2),
                          side: BorderSide(color: Colors.blueAccent),
                        ),
                      ),
                      child: const Text('Sign Up'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }
}
