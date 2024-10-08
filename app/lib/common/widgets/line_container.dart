import 'package:flutter/cupertino.dart';
import 'package:supershop_app/utils/constants/colors.dart';

class LineContainer extends StatelessWidget {
  const LineContainer({
    super.key,
    this.height = 1.5,
    this.color = ColorsString.lightGrey,
    this.width = double.infinity,
  });

  final double? height;
  final double? width;
  final Color? color;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: width,
      decoration: BoxDecoration(
        color: color,
      ),
    );
  }
}
