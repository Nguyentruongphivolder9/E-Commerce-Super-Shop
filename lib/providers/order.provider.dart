import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/features/checkout/models/order_req.dart';
import 'package:supershop_app/features/checkout/services/stripe_service.dart';
import 'package:supershop_app/models/order/order.dart';
import 'package:supershop_app/models/params_config.dart';
import 'package:supershop_app/models/success_response.dart';
import 'package:supershop_app/providers/cart.provider.dart';
import 'package:supershop_app/utils/network/http.dart';
import 'package:url_launcher/url_launcher.dart';

class OrderProvider with ChangeNotifier {
  late final HttpDio _httpDio = HttpDio();
  List<OrderReq> _listOrderForCheckout = [];
  List<OrderReq> get listOrderForCheckout => _listOrderForCheckout;

  List<Order> _listOrders = [];
  List<Order> get listOrders => _listOrders;

  void handleTakeOrdersFromCheckout(List<OrderReq> ordersReq) {
    _listOrderForCheckout.clear();
    _listOrderForCheckout = ordersReq;
  }

  void handleCommentChange(String shopId, String value) {
    _listOrderForCheckout = _listOrderForCheckout.map((order) {
      if (order.shopId == shopId) {
        return order.copyWith(comment: value);
      }
      return order;
    }).toList();

    notifyListeners();
  }

  void handlChangeAdress(String name, String phoneNumber, String adress) {
    _listOrderForCheckout = _listOrderForCheckout.map((order) {
      var newOrder = order.copyWith(
        recipientName: name,
        recipientPhone: phoneNumber,
        recipientAddress: adress,
      );
      return newOrder;
    }).toList();
    notifyListeners();
  }

  void handleChangePaymentThod(String paymentMethod) {
    _listOrderForCheckout = _listOrderForCheckout.map((order) {
      var newOrder = order.copyWith(paymentMethod: paymentMethod);
      return newOrder;
    }).toList();
    notifyListeners();
  }

  Future<void> launchPaymentUrl(String url) async {
    final Uri uri = Uri.parse(url);
    try {
      final bool launched = await launchUrl(
        uri,
        mode: LaunchMode.inAppWebView,
        webViewConfiguration: const WebViewConfiguration(
          enableJavaScript: true,
          enableDomStorage: true,
        ),
      );
      if (!launched) {
        throw 'URL launch failed: $url';
      }
    } catch (e) {
      print('Error launching URL: $e');
      rethrow;
    }
  }

  Future<void> placeOrder(String paymentIntentId) async {
    try {
      final response = await _httpDio.dio.post("mobile/orders/$paymentIntentId",
          data: _listOrderForCheckout.map((order) => order.toJson()).toList());

      final successResponse = SuccessResponse<Map<String, String>>.fromJson(
        response.data,
        (json) {
          return (json as Map<String, dynamic>).map((key, value) {
            return MapEntry(key, value as String);
          });
        },
      );
      if (successResponse.statusCode == 201) {
        _listOrderForCheckout = [];
      } else {
        throw 'Error creating order: ${successResponse.statusCode}';
      }
    } catch (e) {
      print('Error creating order: $e');
      rethrow;
    }
  }

  Future<void> fetOrders(ParamsConfig params) async {
    try {
      final response = await _httpDio.dio.get(
        'orders',
        queryParameters: params.toJson(),
      );
      final successResponse = SuccessResponse<List<Order>>.fromJson(
        response.data,
        (json) => (json as List<dynamic>)
            .map((item) => Order.fromJson(item as Map<String, dynamic>))
            .toList(),
      );
      _listOrders.clear();
      _listOrders.addAll(successResponse.body ?? []);
      notifyListeners();
    } catch (e) {
      print("Error fetching orders: $e");
      throw Exception('Failed to load orders: $e');
    }
  }
}
