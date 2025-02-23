// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class ScaleAlertDialog extends StatelessWidget {
  final String message;
  final Color? textColor;
  final Color? backgroundColor;
  final bool? noIcon;
  final bool? isScale;
  final VoidCallback? onConfirm;
  const ScaleAlertDialog(
      {super.key,
      required this.message,
      this.textColor,
      this.backgroundColor,
      this.onConfirm,
      this.noIcon,
      this.isScale});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      insetPadding:
          isScale == true ? EdgeInsets.symmetric(vertical: 150, horizontal: 75) : EdgeInsets.all(0),
      backgroundColor: backgroundColor ?? const Color.fromARGB(221, 19, 19, 19),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8.0),
      ),
      content: Container(
        padding: EdgeInsets.only(top: 15),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            noIcon == true
                ? SizedBox.shrink() // Không hiển thị gì
                : Icon(
                    Icons.error,
                    color: Colors.white,
                    size: 40,
                  ),
            SizedBox(height: 10),
            Text(
              message,
              style: TextStyle(color: textColor ?? Colors.white),
              textAlign: TextAlign.center,
              softWrap: true,
              maxLines: 3,
            ),
          ],
        ),
      ),
      actions: onConfirm != null
          ? <Widget>[
              TextButton(
                style: TextButton.styleFrom(
                  textStyle: Theme.of(context).textTheme.labelLarge,
                ),
                child: const Text('No'),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
              TextButton(
                style: TextButton.styleFrom(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.zero,
                  ),
                  backgroundColor: const Color.fromARGB(255, 222, 240, 255),
                  textStyle: Theme.of(context).textTheme.labelLarge,
                ),
                child: const Text('Yes'),
                onPressed: () {
                  if (onConfirm != null) {
                    onConfirm!();
                  }
                  Navigator.of(context).pop();
                },
              ),
            ]
          : null,
    );
  }
}
