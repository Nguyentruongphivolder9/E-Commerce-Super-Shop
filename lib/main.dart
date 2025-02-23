import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/features/checkout/const_stripe.dart';
import 'package:supershop_app/providers/advertise.provider.dart';

import 'package:supershop_app/providers/cart.provider.dart';

import 'package:supershop_app/providers/category.provider.dart';

import 'package:supershop_app/features/authen/context/auth_context.dart';

import 'package:supershop_app/providers/deviceInfo.provider.dart';
import 'package:supershop_app/providers/order.provider.dart';
import 'package:supershop_app/providers/product.provider.dart';
import 'package:supershop_app/providers/rating.provider.dart';
import 'package:supershop_app/providers/shop.provider.dart';
import 'package:supershop_app/providers/social.provider.dart';
import 'package:supershop_app/routes/routes.dart';
import 'package:supershop_app/utils/database/database_helper.dart';
import 'features/profile/context/profile_context.dart';

void main() async {
  await _setUp();
  DatabaseHelper dbHelper = DatabaseHelper();

  await dbHelper.deleteAndRecreateDatabase();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ProfileContext()),
        ChangeNotifierProvider(create: (_) => CartProvider()),
        ChangeNotifierProvider(create: (_) => OrderProvider()),
        ChangeNotifierProvider(create: (_) => DeviceProvider()),
        ChangeNotifierProvider(create: (_) => SocialProvider()),
        ChangeNotifierProvider(create: (_) => RatingProvider()),
        ChangeNotifierProvider(create: (_) => CategoryProvider()),
        ChangeNotifierProvider(create: (_) => ProductProvider()),
        ChangeNotifierProvider(create: (_) => AuthContext()),
        ChangeNotifierProvider(create: (_) => ShopProvider()),
        ChangeNotifierProvider(create: (_) => AdvertiseProvider()),
      ],
      child: GetMaterialApp(
        debugShowCheckedModeBanner: false,
        initialRoute: AppPage.getNavbar(),
        getPages: AppPage.routes,
      ),
    ),
  );
}

Future<void> _setUp() async {
  WidgetsFlutterBinding.ensureInitialized();
  Stripe.publishableKey = stripePublishablekey;
}
