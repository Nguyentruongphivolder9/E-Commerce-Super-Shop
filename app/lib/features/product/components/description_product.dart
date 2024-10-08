import 'package:flutter/material.dart';
import 'package:supershop_app/common/widgets/line_container.dart';
import 'package:supershop_app/features/product/components/expandable_product_description%20.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class DescriptionProduct extends StatelessWidget {
  const DescriptionProduct({super.key, required this.product});
  final Product product;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 10),
      color: ColorsString.white,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(vertical: 12),
            width: double.infinity,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Product detail',
                  style: TextStyle(
                    fontSize: Sizes.fontSizeSm,
                    fontWeight: FontWeight.w700,
                    color: ColorsString.black,
                  ),
                ),
                const SizedBox(
                  height: 8,
                ),
                RichText(
                  overflow: TextOverflow.ellipsis,
                  text: TextSpan(
                    text: 'Brand: ',
                    style: const TextStyle(
                      fontSize: Sizes.fontSizeSm,
                      color: ColorsString.darkGrey,
                    ),
                    children: <TextSpan>[
                      TextSpan(
                        text: product.brand,
                        style: const TextStyle(
                          color: ColorsString.black,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(
                  height: 5,
                ),
                RichText(
                  overflow: TextOverflow.ellipsis,
                  text: TextSpan(
                    text: 'Condition: ',
                    style: const TextStyle(
                      fontSize: Sizes.fontSizeSm,
                      color: ColorsString.darkGrey,
                    ),
                    children: <TextSpan>[
                      TextSpan(
                        text: product.conditionProduct.toLowerCase(),
                        style: const TextStyle(
                          color: ColorsString.black,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const LineContainer(),
          ExpandableProductDescription(
            description: product.description,
          )
        ],
      ),
    );
  }
}
