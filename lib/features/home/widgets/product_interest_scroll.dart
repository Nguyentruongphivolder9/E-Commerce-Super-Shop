import 'package:flutter/material.dart';
import 'package:supershop_app/common/widgets/card_product_small.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class ProductInterestScroll extends StatelessWidget {
  const ProductInterestScroll({
    super.key,
    required this.products,
    this.title = "Recently viewed products",
  });
  final List<Product> products;
  final String title;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(left: 12, right: 12, top: 4, bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              children: [
                Text(
                  title,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: ColorsString.primary,
                    fontSize: Sizes.fontSizeMd,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
          ),
          SizedBox(
            height: 230,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: products.length,
              itemBuilder: (context, index) {
                final product = products[index];
                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: SizedBox(
                    height: double.infinity,
                    width: 130,
                    child: CardProductSmall(product: product),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
