import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class NotFoundScreen extends StatelessWidget {
  const NotFoundScreen({
    super.key,
    this.title = 'No found',
    this.icon = const Icon(Icons.error_outline),
  });

  final Widget icon;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        height: double.infinity,
        decoration: const BoxDecoration(color: ColorsString.white),
        child: Center(
          child: Column(
            children: [
              icon,
              Text(
                title,
                style: const TextStyle(
                  fontSize: Sizes.fontSizeXs,
                  color: ColorsString.textSecondary,
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
