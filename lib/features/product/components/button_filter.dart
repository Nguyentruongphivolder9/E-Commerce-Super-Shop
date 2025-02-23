import 'package:flutter/material.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class ButtonFilter extends StatelessWidget {
  const ButtonFilter(
      {super.key,
      required this.text,
      required this.onTap,
      required this.selected});
  final String text;
  final void Function() onTap;
  final bool selected;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        height: double.infinity,
        width: double.infinity,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(Sizes.borderRadiusSm),
          color: ColorsString.lightGrey,
          border: Border.all(
            width: 1,
            color: selected ? ColorsString.primary : Colors.transparent,
          ),
        ),
        padding: const EdgeInsets.all(4),
        child: Center(
          child: Text(
            text,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              color: ColorsString.dark,
              fontSize: Sizes.fontSizeXs,
              fontWeight: FontWeight.w400,
            ),
          ),
        ),
      ),
    );
  }
}
