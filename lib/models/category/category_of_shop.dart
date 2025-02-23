import 'package:json_annotation/json_annotation.dart';

part '../../generated/category/category_of_shop.g.dart';

@JsonSerializable()
class CategoryOfShop {
  String id;
  String name;
  String? imageUrl;
  int totalProduct;
  bool isActive;
  CategoryOfShop({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.totalProduct,
    required this.isActive,
  });

  factory CategoryOfShop.fromJson(Map<String, dynamic> json) =>
      _$CategoryOfShopFromJson(json);
}
