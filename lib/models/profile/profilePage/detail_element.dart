import 'package:flutter/cupertino.dart';
import 'package:supershop_app/models/profile/profilePage/second_floor_detail.dart';

class Detail_Element {
  final IconData icon;
  final String primaryText;
  final String? secondaryText;
  final VoidCallback? onTapIcon;
  final VoidCallback? onTapSecondaryText;

  final List<SecondFloorDetail> secondFloorDetail;

  Detail_Element(
      {required this.icon,
        required this.primaryText,
        this.secondaryText,
        this.onTapIcon,
        this.onTapSecondaryText,
        required this.secondFloorDetail});
}
