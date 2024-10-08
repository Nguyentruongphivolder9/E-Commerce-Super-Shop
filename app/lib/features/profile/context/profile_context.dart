import 'package:flutter/material.dart';
import 'package:supershop_app/features/profile/screens/my_purchases_screen.dart';
import 'package:supershop_app/features/profile/screens/my_rating_screen.dart';
import 'package:supershop_app/models/account/account.dart';
import 'package:supershop_app/utils/database/database_helper.dart';
import '../../../models/auth/device_info.dart';
import '../../../providers/deviceInfo.provider.dart';
import '../widgets/detail_element.dart';
import '../../../models/profile/profilePage/second_floor_detail.dart';

class ProfileContext extends ChangeNotifier {
  List<DetailElement> _detailElementList = [];
  List<DetailElement> get details => _detailElementList;

  Account? _account;
  Account? get account => _account;

  DeviceInfo? _deviceInfo;
  DeviceInfo? get device => _deviceInfo;

  // Phương thức khởi tạo dữ liệu
  Future<void> initializeDetails(BuildContext context) async {
    // My Purchase secondFloor details
    List<SecondFloorDetail> myPurchaseSecondFloor = [
      SecondFloorDetail(
        icon: Icons.payments_outlined,
        name: "To Pay",
        notifications: 2,
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (ctx) => const MyPurchasesScreens(),
            ),
          );
        },
      ),
      SecondFloorDetail(
        icon: Icons.local_shipping_outlined,
        name: "To Ship",
        notifications: 3,
        onTap: () {},
      ),
      SecondFloorDetail(
        icon: Icons.receipt_outlined,
        name: "To Receive",
        notifications: 5,
        onTap: () {},
      ),
      SecondFloorDetail(
        icon: Icons.star_border_outlined,
        name: "To Rate",
        notifications: 2,
        onTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(
              builder: (ctx) => const MyRatingScreen(),
            ),
          );
        },
      ),
    ];

    // My Wallet secondFloor details
    List<SecondFloorDetail> myWalletSecondFloorDetail = [
      SecondFloorDetail(
        icon: Icons.account_balance_wallet_outlined,
        name: "My Vouchers",
        notifications: 2,
        onTap: () {},
      ),
      SecondFloorDetail(
        icon: Icons.favorite_border_outlined,
        name: "Favorites",
        notifications: 1,
        onTap: () {},
      ),
    ];

    // Khởi tạo các DetailElement
    _detailElementList = [
      DetailElement(
        icon: Icons.shopping_cart_outlined,
        primaryText: 'My Purchase',
        secondaryText: 'View Purchase History',
        secondFloorDetail: myPurchaseSecondFloor,
        onTapIcon: () {
          // Xử lý khi nhấn vào icon
        },
        onTapSecondaryText: () {
          // Xử lý khi nhấn vào secondary text
        },
      ),
      DetailElement(
        icon: Icons.account_balance_wallet_outlined,
        primaryText: 'Vouchers & Favorites',
        secondaryText: '',
        secondFloorDetail: myWalletSecondFloorDetail,
        onTapIcon: () {
          // Xử lý khi nhấn vào icon
        },
        onTapSecondaryText: () {
          // Xử lý khi nhấn vào secondary text
        },
      ),
    ];

    await Future.wait([
      _fetchAccountFromDb(),
      _loadDeviceInfo(),
    ]);

    notifyListeners();
  }

  // Fetch Account from DB
  Future<void> _fetchAccountFromDb() async {
    _account = await DatabaseHelper().getAccountFromDb();
  }

  // Fetch device info
  Future<void> _loadDeviceInfo() async {
    DeviceProvider deviceProvider = DeviceProvider();
    _deviceInfo = await deviceProvider.fetchDeviceInfo();
  }
}
