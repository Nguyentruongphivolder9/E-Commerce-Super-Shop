import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/product/product.dart';

part '../../generated/category/category_of_shop_decaration.g.dart';

@JsonSerializable()
class CategoryOfShopDecoration {
  String id;
  String name;
  List<Product>? listProducts;
  CategoryOfShopDecoration({
    required this.id,
    required this.name,
    this.listProducts,
  });

  factory CategoryOfShopDecoration.fromJson(Map<String, dynamic> json) =>
      _$CategoryOfShopDecorationFromJson(json);
}
