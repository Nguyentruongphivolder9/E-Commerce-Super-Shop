// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/order/order_item_res.dart';
// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OrderItemRes _$OrderItemResFromJson(Map<String, dynamic> json) => OrderItemRes(
      id: json['id'] as String?,
      productId: json['productId'] as String,
      productVariantId: json['productVariantId'] as String,
      imageUrl: json['imageUrl'] as String,
      productName: json['productName'] as String,
      variantName: json['variantName'] as String,
      quantity: json['quantity'] as int,
      price: (json['price'] as num).toDouble(),
    );

Map<String, dynamic> _$OrderItemResToJson(OrderItemRes instance) => <String, dynamic>{
      'id': instance.id,
      'productId': instance.productId,
      'productVariantId': instance.productVariantId,
      'imageUrl': instance.imageUrl,
      'productName': instance.productName,
      'variantName': instance.variantName,
      'quantity': instance.quantity,
      'price': instance.price,
    };
