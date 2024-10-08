import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/order/order_item_res.dart';
import 'order_item.dart'; // Giả sử bạn đã định nghĩa OrderItem trong file này

part '../../generated/order/order.g.dart';

@JsonSerializable()
class Order {
  final String? id;
  final String recipientName;
  final String recipientPhone;
  final String recipientAddress;
  final double orderTotal;
  final String orderStatus;
  final String paymentMethod;
  final Map<String, dynamic> shopInfomation;
  final String comment;
  final List<OrderItemRes> orderItems;
  final bool isAnyRefundProcessing;
  final bool isRating;
  final String expiredDateRating;
  final String createdAt;
  final String updatedAt;

  Order({
    this.id,
    required this.recipientName,
    required this.recipientPhone,
    required this.recipientAddress,
    required this.orderTotal,
    required this.orderStatus,
    required this.paymentMethod,
    required this.shopInfomation,
    required this.comment,
    required this.orderItems,
    required this.isAnyRefundProcessing,
    required this.isRating,
    required this.expiredDateRating,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Order.fromJson(Map<String, dynamic> json) => _$OrderFromJson(json);

  Map<String, dynamic> toJson() => _$OrderToJson(this);
}
