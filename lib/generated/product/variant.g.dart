// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/product/variant.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Variant _$VariantFromJson(Map<String, dynamic> json) => Variant(
      id: json['id'] as String,
      name: json['name'] as String,
      imageUrl: json['imageUrl'] != null ? json['imageUrl'] as String : null,
      isActive: json['isActive'] as bool,
    );

Map<String, dynamic> _$VariantToJson(Variant instance) => <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'imageUrl': instance.imageUrl,
      'isActive': instance.isActive,
    };
