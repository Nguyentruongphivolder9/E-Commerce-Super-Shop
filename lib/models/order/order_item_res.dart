import 'package:json_annotation/json_annotation.dart';

part '../../generated/order/order_item_res.g.dart';

@JsonSerializable()
class OrderItemRes {
  final String? id;
  final String productId;
  final String productVariantId;
  final String imageUrl;
  final String productName;
  final String variantName;
  final int quantity;
  final double price;

  OrderItemRes({
    this.id,
    required this.productId,
    required this.productVariantId,
    required this.imageUrl,
    required this.productName,
    required this.variantName,
    required this.quantity,
    required this.price,
  });

  factory OrderItemRes.fromJson(Map<String, dynamic> json) => _$OrderItemResFromJson(json);

  Map<String, dynamic> toJson() => _$OrderItemResToJson(this);
}
