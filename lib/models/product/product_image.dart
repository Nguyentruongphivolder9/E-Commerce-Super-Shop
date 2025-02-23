import 'package:json_annotation/json_annotation.dart';

part '../../generated/product/product_image.g.dart';

@JsonSerializable()
class ProductImage {
  late String id;
  late String imageUrl;
  late bool isPrimary;

  ProductImage({
    required this.id,
    required this.imageUrl,
    required this.isPrimary,
  });

  factory ProductImage.fromJson(Map<String, dynamic> json) =>
      _$ProductImageFromJson(json);

  Map<String, dynamic> toJson() => _$ProductImageToJson(this);
}
