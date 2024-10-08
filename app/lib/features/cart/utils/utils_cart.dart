import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';

void printObject(Object object) {
  final encoder = JsonEncoder.withIndent('  ');

  String prettyPrint;
  if (object is List) {
    // Check if the list is empty or contains elements with toJson method
    if (object.isNotEmpty) {
      // Convert each item in the list
      prettyPrint = encoder.convert(object.map((item) {
        if (item is Map) {
          return item; // Convert Map directly
        } else if (item is dynamic && (item as dynamic).toJson != null) {
          return (item as dynamic).toJson(); // Use toJson if available
        } else {
          return item; // Fallback to default conversion
        }
      }).toList());
    } else {
      // Handle empty list
      prettyPrint = encoder.convert(object);
    }
  } else if (object is Map) {
    // Handle Map object directly
    prettyPrint = encoder.convert(object);
  } else if (object is dynamic && (object as dynamic).toJson != null) {
    // Handle object with toJson method
    prettyPrint = encoder.convert((object as dynamic).toJson());
  } else {
    // Fallback to default conversion
    prettyPrint = encoder.convert(object);
  }

  debugPrint(prettyPrint);
}
