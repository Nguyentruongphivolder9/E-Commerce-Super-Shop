import 'package:supershop_app/models/order/order_item.dart';

class OrderReq {
  String? id;
  String recipientName;
  String recipientPhone;
  String recipientAddress;
  double orderTotal;
  String orderStatus;
  String paymentMethod;
  String shopId;
  String shopName;
  String comment;
  List<OrderItem> orderItems;

  OrderReq({
    this.id,
    required this.recipientName,
    required this.recipientPhone,
    required this.recipientAddress,
    required this.orderTotal,
    required this.orderStatus,
    required this.paymentMethod,
    required this.shopId,
    required this.shopName,
    required this.comment,
    required this.orderItems,
  });

  OrderReq copyWith(
      {String? recipientName,
      String? recipientPhone,
      String? recipientAddress,
      String? comment,
      String? paymentMethod}) {
    return OrderReq(
      id: id,
      recipientName: recipientName ?? this.recipientName,
      recipientPhone: recipientPhone ?? this.recipientPhone,
      recipientAddress: recipientAddress ?? this.recipientAddress,
      orderTotal: orderTotal,
      orderStatus: orderStatus,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      shopId: shopId,
      shopName: shopName,
      comment: comment ?? this.comment,
      orderItems: orderItems,
    );
  }

  // Phương thức từ JSON
  factory OrderReq.fromJson(Map<String, dynamic> json) {
    return OrderReq(
      id: json['id'] as String?,
      recipientName: json['recipientName'] as String,
      recipientPhone: json['recipientPhone'] as String,
      recipientAddress: json['recipientAddress'] as String,
      orderTotal: (json['orderTotal'] as num).toDouble(),
      orderStatus: json['orderStatus'] as String,
      paymentMethod: json['paymentMethod'] as String,
      shopId: json['shopId'] as String,
      shopName: json['shopName'] as String,
      comment: json['comment'] as String,
      orderItems: (json['orderItems'] as List).map((item) => OrderItem.fromJson(item)).toList(),
    );
  }

  // Phương thức chuyển đổi thành JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'recipientName': recipientName,
      'recipientPhone': recipientPhone,
      'recipientAddress': recipientAddress,
      'orderTotal': orderTotal,
      'orderStatus': orderStatus,
      'paymentMethod': paymentMethod,
      'shopId': shopId,
      'shopName': shopName,
      'comment': comment,
      'orderItems': orderItems.map((item) => item.toJson()).toList(),
    };
  }
}
