// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../../models/category/category.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Category _$CategoryFromJson(Map<String, dynamic> json) => Category(
      id: json['id'] as String,
      name: json['name'] as String,
      parentId: json['parentId'] as String?,
      isActive: json['isActive'] as bool,
      isChild: json['isChild'] as bool,
      categoriesChild: (json['categoriesChild'] as List<dynamic>?)
          ?.map((e) => Category.fromJson(e as Map<String, dynamic>))
          .toList(),
      categoryImages: (json['categoryImages'] as List<dynamic>?)
          ?.map((e) => CategoryImage.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
