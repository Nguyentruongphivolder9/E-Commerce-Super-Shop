import 'package:get/get.dart';
import 'package:supershop_app/common/navbar/navbar.dart';
import 'package:supershop_app/features/authen/screens/login.dart';
import 'package:supershop_app/features/cart/screens/cart_screen.dart';
import 'package:supershop_app/features/chat/screens/chat_screen.dart';
import 'package:supershop_app/features/home/screens/home_screens.dart';
import 'package:supershop_app/features/profile/screens/profile_screen.dart';
import 'package:supershop_app/features/profile/widgets/profile_setting.dart';
import 'package:supershop_app/features/social/screens/social_screen.dart';

class AppPage {
  static List<GetPage> routes = [
    GetPage(name: navbar, page: () => const Navbar()),
    GetPage(name: home, page: () => const HomeScreen()),
    GetPage(name: cart, page: () => const CartScreen()),
    GetPage(name: chat, page: () => const ChatScreen()),
    GetPage(name: social, page: () => SocialScreen()),
    GetPage(name: profile, page: () => ProfileScreen()),
    GetPage(name: login, page: () => const Login()),
    GetPage(name: profileSetting, page: () => ProfileSetting()),
  ];

  static getNavbar() => navbar;
  static getHome() => home;
  static getCart() => cart;
  static getChat() => chat;
  static getSocial() => social;
  static getProfile() => profile;
  static getLogin() => login;
  static getProFileSetting() => profileSetting;

  static String navbar = "/";
  static String home = "/home";
  static String cart = "/cart";
  static String chat = "/chat";
  static String social = "/social";
  static String profile = "/profile";
  static String login = "/login";
  static String profileSetting = "/profile-setting";
}
