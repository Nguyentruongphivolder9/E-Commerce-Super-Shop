import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/product/product.dart';

part '../../generated/product/product_with_pagination.g.dart';

@JsonSerializable()
class ProductWithPagination {
  final List<Product> data;
  final int totalPage;

  ProductWithPagination({
    required this.data,
    required this.totalPage,
  });

  factory ProductWithPagination.fromJson(Map<String, dynamic> json) =>
      _$ProductWithPaginationFromJson(json);

  Map<String, dynamic> toJson() => _$ProductWithPaginationToJson(this);
}
