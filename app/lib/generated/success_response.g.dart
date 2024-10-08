// GENERATED CODE - DO NOT MODIFY BY HAND

part of '../models/success_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SuccessResponse<TValue> _$SuccessResponseFromJson<TValue>(
  Map<String, dynamic> json,
  TValue Function(Object?) fromJsonTValue,
) {
  return SuccessResponse<TValue>(
    body: json['body'] == null ? null : fromJsonTValue(json['body']),
    message: json['message'] as String,
    statusCode: json['statusCode'] as int,
    timeStamp: json['timeStamp'] as String,
  );
}

Map<String, dynamic> _$SuccessResponseToJson<TValue>(
  SuccessResponse<TValue> instance,
  TValue Function(TValue) toJsonTValue,
) {
  final val = <String, dynamic>{
    'message': instance.message,
    'statusCode': instance.statusCode,
    'timeStamp': instance.timeStamp,
  };

  if (instance.body != null) {
    val['body'] = toJsonTValue(instance.body!);
  }

  return val;
}
