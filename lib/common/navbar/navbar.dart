import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/controllers/navbar_controller.dart';
import 'package:supershop_app/features/cart/screens/cart_screen.dart';
import 'package:supershop_app/features/chat/screens/chat_screen.dart';
import 'package:supershop_app/features/home/screens/home_screens.dart';
import 'package:supershop_app/features/profile/screens/profile_screen.dart';
import 'package:supershop_app/features/social/screens/social_screen.dart';
import 'package:supershop_app/providers/cart.provider.dart';
import 'package:supershop_app/routes/routes.dart';

class Navbar extends StatefulWidget {
  const Navbar({super.key});

  @override
  State<Navbar> createState() => _NavbarState();
}

class _NavbarState extends State<Navbar> {
  final controller = Get.put(NavbarController());
  @override
  Widget build(BuildContext context) {
    final cartItemCount = Provider.of<CartProvider>(context, listen: true).listCartItem.length;
    return GetBuilder<NavbarController>(builder: (ctx) {
      final currentRoute = Get.currentRoute;
      final hideNavBarAtProfilePage = currentRoute == AppPage.getProfile();
      return Scaffold(
        body: IndexedStack(
          index: controller.tabIndex,
          children: [
            HomeScreen(),
            CartScreen(),
            SocialScreen(),
            ProfileScreen(),
          ],
        ),
        bottomNavigationBar: hideNavBarAtProfilePage
            ? null
            : BottomNavigationBar(
                elevation: 0,
                useLegacyColorScheme: false,
                backgroundColor: Colors.white,
                type: BottomNavigationBarType.fixed,
                selectedFontSize: 12,
                unselectedFontSize: 12,
                selectedItemColor: const Color.fromARGB(255, 38, 144, 231),
                currentIndex: controller.tabIndex,
                onTap: controller.changeTabIndex,
                items: [
                  const BottomNavigationBarItem(
                      icon: Icon(Icons.home_outlined),
                      label: 'home',
                      activeIcon: Icon(Icons.home_rounded)),
                  BottomNavigationBarItem(
                    icon: Stack(
                      clipBehavior: Clip.none,
                      children: [
                        const Icon(Icons.shopping_cart_outlined),
                        Positioned(
                          top: -2,
                          left: 12,
                          child: Container(
                            width: 13,
                            height: 13,
                            decoration: BoxDecoration(color: Colors.amber, shape: BoxShape.circle),
                            alignment: Alignment.center,
                            child: Text(
                              "${cartItemCount}",
                              style: TextStyle(fontSize: 8, color: Colors.white),
                            ),
                          ),
                        ),
                      ],
                    ),
                    label: 'Store',
                    activeIcon: Stack(
                      clipBehavior: Clip.none,
                      children: [
                        const Icon(Icons.shopping_cart_rounded),
                        Positioned(
                          top: -2,
                          left: 12,
                          child: Container(
                            width: 13,
                            height: 13,
                            decoration: BoxDecoration(color: Colors.amber, shape: BoxShape.circle),
                            alignment: Alignment.center,
                            child: Text(
                              "${cartItemCount}",
                              style: TextStyle(fontSize: 8, color: Colors.white),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  BottomNavigationBarItem(
                    icon: Stack(
                      clipBehavior: Clip.none,
                      children: [
                        const Icon(Icons.message_outlined),
                        Positioned(
                          top: -3,
                          left: 12,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 1),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(20),
                              color: Colors.amber,
                            ),
                            alignment: Alignment.center,
                            child: const Text(
                              '12',
                              style: TextStyle(fontSize: 8, color: Colors.white),
                            ),
                          ),
                        ),
                      ],
                    ),
                    label: 'Messages',
                    activeIcon: Stack(
                      clipBehavior: Clip.none,
                      children: [
                        const Icon(Icons.message_rounded),
                        Positioned(
                          top: -3,
                          left: 12,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 1),
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(20),
                              color: Colors.amber,
                            ),
                            alignment: Alignment.center,
                            child: const Text(
                              '12',
                              style: TextStyle(fontSize: 8, color: Colors.white),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const BottomNavigationBarItem(
                    icon: Icon(Icons.person_outline),
                    label: 'Profile',
                    activeIcon: Icon(Icons.person_rounded),
                  ),
                ],
              ),
      );
    });
  }
}
