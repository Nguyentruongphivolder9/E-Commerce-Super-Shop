import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/enums/order_by.dart';
import 'package:supershop_app/enums/sort_by.dart';

part '../generated/params_config.g.dart';

@JsonSerializable()
class ParamsConfig {
  final String? page;
  final String? limit;
  final String? sort_by;
  final String? category;
  final String? name;
  final String? order;
  final String? price_max;
  final String? price_min;
  final String? rating_filter;
  final String? exclude;
  final String? search;
  final String? status;
  final String? violationType;
  final String? condition;

  ParamsConfig({
    this.page,
    this.limit,
    this.sort_by,
    this.category,
    this.name,
    this.order,
    this.price_max,
    this.price_min,
    this.rating_filter,
    this.exclude,
    this.search,
    this.status,
    this.violationType,
    this.condition,
  });

  ParamsConfig copyWith({
    String? page,
    String? limit,
    String? sort_by,
    String? category,
    String? name,
    String? order,
    String? price_max,
    String? price_min,
    String? rating_filter,
    String? exclude,
    String? search,
    String? status,
    String? violationType,
    String? condition,
  }) {
    return ParamsConfig(
      page: page ?? this.page,
      limit: limit ?? this.limit,
      sort_by: sort_by ?? this.sort_by,
      category: category ?? this.category,
      name: name ?? this.name,
      order: order ?? this.order,
      price_max: price_max ?? this.price_max,
      price_min: price_min ?? this.price_min,
      rating_filter: rating_filter ?? this.rating_filter,
      exclude: exclude ?? this.exclude,
      search: search ?? this.search,
      status: status ?? this.status,
      violationType: violationType ?? this.violationType,
      condition: condition ?? this.condition,
    );
  }

  factory ParamsConfig.fromJson(Map<String, dynamic> json) =>
      _$ParamsConfigFromJson(json);

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> json = _$ParamsConfigToJson(this);

    json['page'] ??= '1';
    json['limit'] ??= '20';

    json.removeWhere(
        (key, value) => value == null || (value is String && value.isEmpty));

    return json;
  }
}
