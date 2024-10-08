// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/product/variants_group.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VariantsGroup _$VariantsGroupFromJson(Map<String, dynamic> json) =>
    VariantsGroup(
      id: json['id'] as String,
      name: json['name'] as String,
      isPrimary: json['isPrimary'] as bool,
      variants: (json['variants'] as List<dynamic>)
          .map((e) => Variant.fromJson(e as Map<String, dynamic>))
          .toList(),
    );

Map<String, dynamic> _$VariantsGroupToJson(VariantsGroup instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'isPrimary': instance.isPrimary,
      'variants': instance.variants,
    };
