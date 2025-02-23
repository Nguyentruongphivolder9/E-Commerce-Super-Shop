class CartItemRequest {
  final String id;
  final String shopId;
  final String productId;
  final String productVariantId;
  final int? quantity;

  CartItemRequest(
      {required this.id,
      required this.shopId,
      required this.productId,
      required this.productVariantId,
      this.quantity});

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'shopId': shopId,
      'productId': productId,
      'productVariantId': productVariantId,
      'quantity': quantity,
    };
  }

  Map<String, dynamic> toJsonWithoutQty() {
    return {
      'id': id,
      'shopId': shopId,
      'productId': productId,
      'productVariantId': productVariantId,
    };
  }
}
