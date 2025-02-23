import 'package:flutter/material.dart';
import 'package:supershop_app/common/widgets/card_product.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class ListProduct extends StatelessWidget {
  const ListProduct({super.key, required this.listProduct});

  final List<Product> listProduct;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: const BoxDecoration(color: ColorsString.white),
      child: Column(
        children: [
          GridView.builder(
            itemCount: listProduct.length,
            shrinkWrap: true,
            padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: Sizes.gridViewSpacing,
              crossAxisSpacing: Sizes.gridViewSpacing,
              mainAxisExtent: 270,
            ),
            itemBuilder: (_, index) => CardProduct(
              product: listProduct[index],
            ),
          ),
        ],
      ),
    );
  }
}
