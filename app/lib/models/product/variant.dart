import 'package:json_annotation/json_annotation.dart';

part '../../generated/product/variant.g.dart';

@JsonSerializable()
class Variant {
  late String id;
  late String name;
  late String? imageUrl;
  late bool isActive;

  Variant({
    required this.id,
    required this.name,
    this.imageUrl,
    required this.isActive,
  });

  factory Variant.fromJson(Map<String, dynamic> json) =>
      _$VariantFromJson(json);

  Map<String, dynamic> toJson() => _$VariantToJson(this);
}
