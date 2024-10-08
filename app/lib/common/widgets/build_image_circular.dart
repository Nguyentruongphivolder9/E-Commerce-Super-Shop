import 'package:flutter/material.dart';
import 'package:supershop_app/common/widgets/rounded_image.dart';
import 'package:supershop_app/utils/converts/image.dart';

class BuildImageCircular extends StatelessWidget {
  const BuildImageCircular({super.key, this.imageUrl, required this.size});
  final String? imageUrl;
  final double size;

  @override
  Widget build(BuildContext context) {
    if (imageUrl != null && imageUrl!.isNotEmpty) {
      return RoundedImage(
        height: size,
        width: size,
        fit: BoxFit.cover,
        imageUrl: generateURLAvatar(imageUrl!),
        borderRadius: BorderRadius.all(
          Radius.circular(size),
        ),
        isNetworkImage: true,
      );
    } else {
      return Container(
        height: size,
        width: size,
        decoration: BoxDecoration(
          color: Colors.grey,
          borderRadius: BorderRadius.all(
            Radius.circular(size),
          ),
        ),
        child: const Icon(
          Icons.person,
          color: Colors.white,
          size: 20,
        ),
      );
    }
  }
}
