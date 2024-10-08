import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/product/product.dart';

part '../../generated/cartItem/cart_item.g.dart';

@JsonSerializable()
class CartItem {
  late String id;
  late String productVariantId;
  late Product product;
  late Map<String, dynamic> shopInfo;
  late int quantity;
  late String createdAt;
  late String updatedAt;

  CartItem(
      {required this.id,
      required this.productVariantId,
      required this.product,
      required this.shopInfo,
      required this.quantity,
      required this.createdAt,
      required this.updatedAt});
  factory CartItem.fromJson(Map<String, dynamic> json) => _$CartItemFromJson(json);

  Map<String, dynamic> toJson() => _$CartItemToJson(this);
}
