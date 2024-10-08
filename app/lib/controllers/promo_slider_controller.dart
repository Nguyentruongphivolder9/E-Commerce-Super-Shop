import 'package:get/get.dart';

class PromoSliderController extends GetxController {
  static PromoSliderController get instance => Get.find();

  final bannerCurrentIndex = 0.obs;
  final shopTabsCurrentIndex = 0.obs;
  final productImageCurrentIndex = 0.obs;

  void updateItemIndicatorBanner(index) {
    bannerCurrentIndex.value = index;
  }

  void updateItemIndicatorShopTabs(index) {
    shopTabsCurrentIndex.value = index;
  }

  void updateItemIndicatorProductImage(index) {
    productImageCurrentIndex.value = index;
  }
}
