// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/cart/cart_item.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CartItem _$CartItemFromJson(Map<String, dynamic> json) => CartItem(
      id: json['id'] as String,
      productVariantId: json['productVariantId'] as String,
      product: Product.fromJson(json['product'] as Map<String, dynamic>),
      shopInfo: json['shopInfo'] as Map<String, dynamic>,
      quantity: json['quantity'] as int,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );

Map<String, dynamic> _$CartItemToJson(CartItem instance) => <String, dynamic>{
      'id': instance.id,
      'productVariantId': instance.productVariantId,
      'product': instance.product.toJson(),
      'shopInfo': instance.shopInfo,
      'quantity': instance.quantity,
      'createdAt': instance.createdAt,
      'updatedAt': instance.updatedAt,
    };
