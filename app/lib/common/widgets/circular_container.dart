import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class CCircularContainer extends StatelessWidget {
  const CCircularContainer({
    super.key,
    this.width = 400,
    this.height = 400,
    this.radius = 10,
    this.padding = 0,
    this.margin,
    this.child,
    this.backgroundColor = Colors.white,
  });

  final double? width;
  final double? height;
  final double radius;
  final double padding;
  final EdgeInsets? margin;
  final Widget? child;
  final Color backgroundColor;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      margin: margin,
      padding: EdgeInsets.all(padding),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(radius),
        color: backgroundColor,
      ),
      child: child,
    );
  }
}