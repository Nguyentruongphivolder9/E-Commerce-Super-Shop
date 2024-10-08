import 'package:supershop_app/features/cart/extendedModel/extended_cart_item.dart';

class CartItemExtendedByShop {
  Map<String, dynamic> shopInfo;
  List<CartItemExtended> items;

  CartItemExtendedByShop({
    required this.shopInfo,
    required this.items,
  });

  Map<String, dynamic> toJson() {
    return {
      'shopInfo': shopInfo,
      'items': items.map((item) => item.toJson()).toList(),
    };
  }
}
