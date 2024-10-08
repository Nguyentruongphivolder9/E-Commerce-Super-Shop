import 'package:json_annotation/json_annotation.dart';

part '../../generated/category/category_image.g.dart';

@JsonSerializable()
class CategoryImage {
  String id;
  String imageUrl;
  CategoryImage({required this.id, required this.imageUrl});

  factory CategoryImage.fromJson(Map<String, dynamic> json) =>
      _$CategoryImageFromJson(json);
}
