import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:supershop_app/utils/constants/colors.dart';

class LoadingScreen extends StatelessWidget {
  const LoadingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        height: double.infinity,
        decoration: const BoxDecoration(color: ColorsString.white),
        child: const Center(child: CircularProgressIndicator()),
      ),
    );
  }
}
