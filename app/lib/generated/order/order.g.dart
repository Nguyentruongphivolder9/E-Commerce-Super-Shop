// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/order/order.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Order _$OrderFromJson(Map<String, dynamic> json) => Order(
      id: json['id'] as String?,
      recipientName: json['recipientName'] as String,
      recipientPhone: json['recipientPhone'] as String,
      recipientAddress: json['recipientAddress'] as String,
      orderTotal: (json['orderTotal'] as num).toDouble(),
      orderStatus: json['orderStatus'] as String,
      paymentMethod: json['paymentMethod'] as String,
      shopInfomation: json['shopInfomation'] as Map<String, dynamic>,
      comment: json['comment'] as String,
      orderItems: (json['orderItems'] as List<dynamic>)
          .map((e) => OrderItemRes.fromJson(e as Map<String, dynamic>))
          .toList(),
      isAnyRefundProcessing: json['isAnyRefundProcessing'] as bool,
      isRating: json['isRating'] as bool,
      expiredDateRating: json['expiredDateRating'] as String,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );

Map<String, dynamic> _$OrderToJson(Order instance) => <String, dynamic>{
      'id': instance.id,
      'recipientName': instance.recipientName,
      'recipientPhone': instance.recipientPhone,
      'recipientAddress': instance.recipientAddress,
      'orderTotal': instance.orderTotal,
      'orderStatus': instance.orderStatus,
      'paymentMethod': instance.paymentMethod,
      'shopInfomation': instance.shopInfomation,
      'comment': instance.comment,
      'orderItems': instance.orderItems.map((e) => e.toJson()).toList(),
      'isAnyRefundProcessing': instance.isAnyRefundProcessing,
      'expiredDateRating': instance.expiredDateRating,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };
