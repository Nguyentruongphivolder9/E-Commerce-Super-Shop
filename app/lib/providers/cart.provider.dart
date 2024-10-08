import 'dart:convert';

import 'package:collection/collection.dart';
import 'package:flutter/material.dart';
import 'package:supershop_app/features/cart/extendedModel/cart_item_request.dart';
import 'package:supershop_app/features/cart/extendedModel/extended_cart_item.dart';
import 'package:supershop_app/features/cart/extendedModel/extended_cart_item_byshop.dart';
import 'package:supershop_app/features/cart/utils/utils_cart.dart';
import 'package:supershop_app/models/cart/cart_item.dart';
import 'package:supershop_app/models/success_response.dart';
import 'package:supershop_app/utils/converts/utils_product.dart';
import 'package:supershop_app/utils/network/http.dart';

class CartProvider with ChangeNotifier {
  late final HttpDio _httpDio = HttpDio();
  List<CartItem> _listCartItem = [];
  List<CartItem> get listCartItem => _listCartItem;
  List<CartItemExtendedByShop> _listCartItemByShop = [];
  List<CartItemExtendedByShop> get listCartItemByShop => _listCartItemByShop;
  List<CartItemExtendedByShop> _listCheckedItemByShop = [];
  List<CartItemExtendedByShop> get listCheckedItemByShop =>
      _listCheckedItemByShop;
  CartItem? _cartItem;
  CartItem? get cartItem => _cartItem;

  Future<void> fetchCart() async {
    try {
      final response = await _httpDio.dio.get('mobile/cart');
      final successResponse = SuccessResponse<List<CartItem>>.fromJson(
        response.data,
        (json) => (json as List<dynamic>)
            .map((item) => CartItem.fromJson(item as Map<String, dynamic>))
            .toList(),
      );
      _listCartItem.clear();
      _listCartItem.addAll(successResponse.body ?? []);
      _transformCartItems();
      notifyListeners();
    } catch (e) {
      print("Error fetching cart: $e");
      throw Exception('Failed to load cart: $e');
    }
  }

  void _transformCartItems() {
    final Map<String, CartItemExtendedByShop> groupedItems = {};

    for (var cartItem in _listCartItem) {
      final shopId = cartItem.shopInfo['id'] as String;

      final cartItemExtended = CartItemExtended(
        id: cartItem.id,
        quantity: cartItem.quantity,
        productVariantId: cartItem.productVariantId,
        product: cartItem.product,
        shopInfo: cartItem.shopInfo,
        createdAt: cartItem.createdAt,
        updatedAt: cartItem.updatedAt,
        checked: false,
        disabled: false,
      );
      if (!groupedItems.containsKey(shopId)) {
        groupedItems[shopId] = CartItemExtendedByShop(
          shopInfo: {
            'id': shopId,
            'fullName': cartItem.shopInfo['fullName'] ?? 'Unknown Shop',
            'userName': cartItem.shopInfo['userName'] ?? 'Unknown userName',
            'avatarUrl': cartItem.shopInfo['avatarUrl'] ?? 'Unknown avatarUrl'
          },
          items: [],
        );
      }
      groupedItems[shopId]!.items.add(cartItemExtended);
    }
    _listCartItemByShop = groupedItems.values.toList();
    notifyListeners();
  }

  void toggleItemChecked(int shopIndex, int cartItemIndex, bool value) {
    final shopGroup = _listCartItemByShop[shopIndex];
    final item = shopGroup.items[cartItemIndex];
    final updatedItem = item.copyWith(checked: value);
    shopGroup.items[cartItemIndex] = updatedItem;
    _listCheckedItemByShop = filterCheckedItemsByShop();
    notifyListeners();
  }

  void toggleItemOnShop(int shopIndex, bool value) {
    final shopGroup = _listCartItemByShop[shopIndex];
    for (var i = 0; i < shopGroup.items.length; i++) {
      final item = shopGroup.items[i];
      final updatedItem = item.copyWith(checked: value);
      shopGroup.items[i] = updatedItem;
    }
    _listCheckedItemByShop = filterCheckedItemsByShop();
    notifyListeners();
  }

  void toggleAll(bool value) {
    for (var shopGroup in _listCartItemByShop) {
      for (var i = 0; i < shopGroup.items.length; i++) {
        final item = shopGroup.items[i];
        final updatedItem = item.copyWith(checked: value);
        shopGroup.items[i] = updatedItem;
      }
    }
    _listCheckedItemByShop = filterCheckedItemsByShop();
    notifyListeners();
  }

  List<CartItemExtendedByShop> filterCheckedItemsByShop() {
    return _listCartItemByShop.where((shopGroup) {
      return shopGroup.items.any((item) => item.checked);
    }).map((shopGroup) {
      return CartItemExtendedByShop(
        shopInfo: shopGroup.shopInfo,
        items: shopGroup.items.where((item) => item.checked).toList(),
      );
    }).toList();
  }

  void handleChangeQuantity(int indexShop, int indexCartItem, int value) async {
    final shopGroup = _listCartItemByShop[indexShop];
    final itemWillChange = shopGroup.items[indexCartItem];
    final updatedItem = itemWillChange.copyWith(quantity: value);
    // shopGroup.items[indexCartItem] = updatedItem;
    final maxStockByProductVariant = handleStockQuantityProduct(
        itemWillChange.product, itemWillChange.productVariantId);
    final isSatisfyStockQuantity =
        value <= maxStockByProductVariant && value >= 1;
    if (!isSatisfyStockQuantity) return;

    final response = await _httpDio.dio.put('/cart', data: {
      'productId': itemWillChange.product.id,
      'shopId': itemWillChange.shopInfo['id'],
      'productVariantId': itemWillChange.productVariantId,
      'quantity': value,
    });

    final successResponse = SuccessResponse<CartItem>.fromJson(
      response.data,
      (json) => CartItem.fromJson(json as Map<String, dynamic>),
    );

    if (successResponse.statusCode == 200) {
      CartItem? newUpdatedItem = successResponse.body;
      final index =
          _listCartItem.indexWhere((item) => item.id == newUpdatedItem?.id);
      if (index != -1) {
        _listCartItem[index] = newUpdatedItem as CartItem;
      }

      final shopIndex = _listCartItemByShop.indexWhere(
          (shop) => shop.shopInfo['id'] == itemWillChange.shopInfo['id']);
      if (shopIndex != -1) {
        final itemIndex = _listCartItemByShop[shopIndex]
            .items
            .indexWhere((i) => i.id == newUpdatedItem?.id);
        if (itemIndex != -1) {
          _listCartItemByShop[shopIndex].items[itemIndex] = updatedItem;
        }
      }

      _listCheckedItemByShop = filterCheckedItemsByShop();
    }
    notifyListeners();
  }

  void handleDeleteItem(int indexShop, String cartId) async {
    try {
      final response = await _httpDio.dio.delete(
        '/cart',
        data: {
          'listIdCartItem': [cartId],
        },
      );

      final successResponse = SuccessResponse<Map<String, int>>.fromJson(
        response.data,
        (json) {
          return (json as Map<String, dynamic>).map((key, value) {
            return MapEntry(key, value as int);
          });
        },
      );

      if (successResponse.statusCode == 200) {
        final index = _listCartItem.indexWhere((item) => item.id == cartId);
        if (index != -1) {
          _listCartItem = [..._listCartItem]..removeAt(index);
        }

        _listCartItemByShop = _listCartItemByShop
            .map((shopGroup) {
              shopGroup.items =
                  shopGroup.items.where((item) => item.id != cartId).toList();
              return shopGroup;
            })
            .where((shopGroup) => shopGroup.items.isNotEmpty)
            .toList();

        _listCheckedItemByShop = _listCheckedItemByShop
            .map((shopGroup) {
              shopGroup.items =
                  shopGroup.items.where((item) => item.id != cartId).toList();
              return shopGroup;
            })
            .where((shopGroup) => shopGroup.items.isNotEmpty)
            .toList();
      }

      notifyListeners();
    } catch (e) {
      print("Error fetching cart: $e");
      throw Exception('Failed to load cart: $e');
    }
  }

  void handleDeleteAll() async {
    var listIdCartItem = _listCheckedItemByShop
        .expand((shop) => shop.items.map((item) => item.id))
        .toList();

    try {
      final response = await _httpDio.dio.delete(
        '/cart',
        data: {
          'listIdCartItem': listIdCartItem,
        },
      );

      final successResponse = SuccessResponse<Map<String, int>>.fromJson(
        response.data,
        (json) {
          return (json as Map<String, dynamic>).map((key, value) {
            return MapEntry(key, value as int);
          });
        },
      );

      if (successResponse.statusCode == 200) {
        final idsToRemove = Set<String>.from(listIdCartItem);
        _listCartItem = _listCartItem
            .where((item) => !idsToRemove.contains(item.id))
            .toList();

        _listCartItemByShop = _listCartItemByShop
            .map((shopGroup) {
              shopGroup.items = shopGroup.items
                  .where((item) => !idsToRemove.contains(item.id))
                  .toList();
              return shopGroup;
            })
            .where((shopGroup) => shopGroup.items.isNotEmpty)
            .toList();
        _listCheckedItemByShop = [];
      }

      notifyListeners();
    } catch (e) {
      print("Error fetching cart: $e");
      throw Exception('Failed to load cart: $e');
    }
  }

  Future<String> handleUpdateSelectedVariant(
      CartItemRequest requestUpdateVariant) async {
    var itemNeedtoUpdate = _listCartItemByShop
        .expand((shop) => shop.items)
        .firstWhereOrNull((item) => item.id == requestUpdateVariant.id);
    printObject(requestUpdateVariant);
    final updatedItem = itemNeedtoUpdate!
        .copyWith(productVariantId: requestUpdateVariant.productVariantId);
    try {
      final response = await _httpDio.dio.put('/cart/productVariant',
          data: requestUpdateVariant.toJsonWithoutQty());
      final successResponse = SuccessResponse<CartItem>.fromJson(
        response.data,
        (json) => CartItem.fromJson(json as Map<String, dynamic>),
      );

      if (successResponse.statusCode == 200) {
        CartItem? newUpdatedItem = successResponse.body;
        final index =
            _listCartItem.indexWhere((item) => item.id == newUpdatedItem?.id);
        if (index != -1) {
          _listCartItem[index] = newUpdatedItem as CartItem;
        }

        final shopIndex = _listCartItemByShop.indexWhere(
            (shop) => shop.shopInfo['id'] == requestUpdateVariant.shopId);
        if (shopIndex != -1) {
          final itemIndex = _listCartItemByShop[shopIndex]
              .items
              .indexWhere((i) => i.id == newUpdatedItem?.id);
          if (itemIndex != -1) {
            _listCartItemByShop[shopIndex].items[itemIndex] = updatedItem;
          }
        }
        _listCheckedItemByShop = filterCheckedItemsByShop();
        notifyListeners();
      }
      return "OK";
    } catch (e) {
      return "You already have this variation in your cart";
    }
  }

  Future<bool> addToCart(Map<String, dynamic> body) async {
    try {
      final response = await _httpDio.dio.post(
        'cart',
        data: jsonEncode(body),
      );
      final successResponse = SuccessResponse<CartItem>.fromJson(
        response.data,
        (json) => CartItem.fromJson(json as Map<String, dynamic>),
      );
      if (successResponse.statusCode == 201) {
        if (successResponse.body != null) {
          fetchCart();
          notifyListeners();
          return true;
        }
      }
    } catch (e) {
      print("Add cart error");
    }
    return false;
  }
}
