import 'package:flutter/cupertino.dart';

class SecondFloorDetail {
  final IconData icon;
  final String name;
  final String? description;
  final int? notifications;
  final void Function() onTap;

  SecondFloorDetail({
    required this.icon,
    required this.name,
    this.description,
    this.notifications,
    required this.onTap,
  });
}
