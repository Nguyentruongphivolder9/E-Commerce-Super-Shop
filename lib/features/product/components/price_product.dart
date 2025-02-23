import 'package:flutter/cupertino.dart';
import 'package:supershop_app/utils/converts/number.dart';
import 'package:supershop_app/utils/constants/colors.dart';

class PriceProduct extends StatelessWidget {
  const PriceProduct({
    super.key,
    required this.iconSize,
    required this.textSize,
    required this.fontWeight,
    required this.price,
  });
  final double price;
  final double iconSize;
  final double textSize;
  final FontWeight fontWeight;

  @override
  Widget build(BuildContext context) {
    return RichText(
      overflow: TextOverflow.ellipsis,
      text: TextSpan(
        text: '₫',
        style: TextStyle(
          fontSize: iconSize,
          color: ColorsString.primary,
          fontWeight: fontWeight,
          // letterSpacing: 1.0,
        ),
        children: <TextSpan>[
          TextSpan(
            text: formatCurrency(price),
            style: TextStyle(
              fontSize: textSize,
            ),
          ),
        ],
      ),
    );
  }
}
