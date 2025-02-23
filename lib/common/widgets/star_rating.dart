import 'package:flutter/material.dart';

class StarRating extends StatelessWidget {
  final double rating;
  final double size;
  final Color activeColor;
  final Color nonActiveColor;

  const StarRating({
    Key? key,
    required this.rating,
    this.size = 24.0,
    this.activeColor = Colors.yellow,
    this.nonActiveColor = Colors.grey,
  }) : super(key: key);

  double handleWidth(int order) {
    if (order <= rating) {
      return 1.0;
    } else if (order > rating && order - rating < 1) {
      return rating - order + 1;
    }
    return 0.0;
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: List.generate(5, (index) {
        return Stack(
          children: [
            Icon(
              Icons.star,
              size: size,
              color: nonActiveColor,
            ),
            ClipRect(
              child: Align(
                alignment: Alignment.topLeft,
                widthFactor: handleWidth(index + 1),
                child: Icon(
                  Icons.star,
                  size: size,
                  color: activeColor,
                ),
              ),
            ),
          ],
        );
      }),
    );
  }
}
