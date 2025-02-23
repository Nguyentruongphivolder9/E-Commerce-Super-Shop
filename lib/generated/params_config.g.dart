// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../models/params_config.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ParamsConfig _$ParamsConfigFromJson(Map<String, dynamic> json) => ParamsConfig(
      page: json['page'] as String?,
      limit: json['limit'] as String?,
      sort_by: json['sort_by'] as String?,
      category: json['category'] as String?,
      name: json['name'] as String?,
      order: json['order'] as String?,
      price_max: json['price_max'] as String?,
      price_min: json['price_min'] as String?,
      rating_filter: json['rating_filter'] as String?,
      exclude: json['exclude'] as String?,
      search: json['search'] as String?,
      status: json['status'] as String?,
      violationType: json['violationType'] as String?,
      condition: json['condition'] as String?,
    );

Map<String, dynamic> _$ParamsConfigToJson(ParamsConfig instance) =>
    <String, dynamic>{
      'page': instance.page,
      'limit': instance.limit,
      'sort_by': instance.sort_by.toString(),
      'category': instance.category,
      'name': instance.name,
      'order': instance.order,
      'price_max': instance.price_max,
      'price_min': instance.price_min,
      'rating_filter': instance.rating_filter,
      'exclude': instance.exclude,
      'search': instance.search,
      'status': instance.status,
      'violationType': instance.violationType,
      'condition': instance.condition,
    };
