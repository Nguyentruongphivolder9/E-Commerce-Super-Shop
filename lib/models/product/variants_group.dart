import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/product/variant.dart';

part '../../generated/product/variants_group.g.dart';

@JsonSerializable()
class VariantsGroup {
  late String id;
  late String name;
  late bool isPrimary;
  late List<Variant> variants;

  VariantsGroup({
    required this.id,
    required this.name,
    required this.isPrimary,
    required this.variants,
  });

  factory VariantsGroup.fromJson(Map<String, dynamic> json) =>
      _$VariantsGroupFromJson(json);

  Map<String, dynamic> toJson() => _$VariantsGroupToJson(this);
}
