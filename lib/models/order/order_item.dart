import 'package:json_annotation/json_annotation.dart';

part '../../generated/order/order_item.g.dart';

@JsonSerializable()
class OrderItem {
  final String? id;
  final String cartItemId;
  final String productId;
  final String productVariantId;
  final String imageUrl;
  final String productName;
  final String variantName;
  final int quantity;
  final double price;

  OrderItem({
    this.id,
    required this.cartItemId,
    required this.productId,
    required this.productVariantId,
    required this.imageUrl,
    required this.productName,
    required this.variantName,
    required this.quantity,
    required this.price,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) => _$OrderItemFromJson(json);

  Map<String, dynamic> toJson() => _$OrderItemToJson(this);
}
