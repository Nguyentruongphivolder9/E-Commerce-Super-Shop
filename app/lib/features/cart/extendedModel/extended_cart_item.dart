import 'package:supershop_app/models/product/product.dart';

class CartItemExtended {
  final String id;
  final String productVariantId;
  final Product product;
  final Map<String, dynamic> shopInfo;
  final int quantity;
  final String createdAt;
  final String updatedAt;
  bool checked;
  bool disabled;

  CartItemExtended({
    required this.id,
    required this.productVariantId,
    required this.product,
    required this.shopInfo,
    required this.quantity,
    required this.createdAt,
    required this.updatedAt,
    required this.checked,
    required this.disabled,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'quantity': quantity,
      'productVariantId': productVariantId,
      'product': product, // Ensure product is serializable
      'shopInfo': shopInfo,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
      'checked': checked,
      'disabled': disabled,
    };
  }

  CartItemExtended copyWith({
    String? id,
    int? quantity,
    String? productVariantId,
    Product? product,
    Map<String, dynamic>? shopInfo,
    String? createdAt,
    String? updatedAt,
    bool? checked,
    bool? disabled,
  }) {
    return CartItemExtended(
      id: id ?? this.id,
      quantity: quantity ?? this.quantity,
      productVariantId: productVariantId ?? this.productVariantId,
      product: product ?? this.product,
      shopInfo: shopInfo ?? this.shopInfo,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      checked: checked ?? this.checked,
      disabled: disabled ?? this.disabled,
    );
  }
}
