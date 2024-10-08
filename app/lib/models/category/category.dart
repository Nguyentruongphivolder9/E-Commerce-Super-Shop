import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/category/category_image.dart';

part '../../generated/category/category.g.dart';

@JsonSerializable()
class Category {
  String id;
  String name;
  String? parentId;
  bool isActive;
  bool isChild;

  List<Category>? categoriesChild;
  List<CategoryImage>? categoryImages;
  Category({
    required this.id,
    required this.name,
    this.parentId,
    required this.isActive,
    required this.isChild,
    this.categoriesChild,
    this.categoryImages,
  });

  factory Category.fromJson(Map<String, dynamic> json) =>
      _$CategoryFromJson(json);
}
