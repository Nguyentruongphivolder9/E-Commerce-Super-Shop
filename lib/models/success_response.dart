import 'package:json_annotation/json_annotation.dart';

part '../generated/success_response.g.dart';

@JsonSerializable()
class SuccessResponse<TValue> {
  late TValue? body;
  late String message;
  late int statusCode;
  late String timeStamp;

  SuccessResponse({
    required this.body,
    required this.message,
    required this.statusCode,
    required this.timeStamp,
  });

  factory SuccessResponse.fromJson(
          Map<String, dynamic> json, TValue Function(Object?) fromJsonTValue) =>
      _$SuccessResponseFromJson<TValue>(json, fromJsonTValue);

  Map<String, dynamic> toJson(TValue Function(TValue) toJsonTValue) =>
      _$SuccessResponseToJson<TValue>(this, toJsonTValue);
}
