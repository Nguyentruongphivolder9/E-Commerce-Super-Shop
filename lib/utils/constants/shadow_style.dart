import 'package:flutter/material.dart';
import 'package:supershop_app/utils/constants/colors.dart';

class ShadowStyle {
  static const verticalProductShadow = BoxShadow(
    color: ColorsString.grey,
    blurRadius: 2,
    spreadRadius: 1,
    offset: Offset(0, 1),
  );
  static const horizontalProductShadow = BoxShadow(
    color: ColorsString.grey,
    blurRadius: 2,
    spreadRadius: 1,
    offset: Offset(0, 1),
  );
}
