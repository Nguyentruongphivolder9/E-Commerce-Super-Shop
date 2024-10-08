import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/product/product.dart';

part '../../generated/product/product_pagination.g.dart';

@JsonSerializable()
class ProductPagination {
  List<Product>? listProducts;
  int totalPages;
  ProductPagination({
    this.listProducts,
    required this.totalPages,
  });

  factory ProductPagination.fromJson(Map<String, dynamic> json) =>
      _$ProductPaginationFromJson(json);
}
