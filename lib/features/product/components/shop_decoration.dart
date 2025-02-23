import 'package:flutter/material.dart';
import 'package:supershop_app/common/widgets/line_container.dart';
import 'package:supershop_app/common/widgets/list_product.dart';
import 'package:supershop_app/features/home/widgets/product_interest_scroll.dart';
import 'package:supershop_app/models/category/category_of_shop_decoration.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class ShopDecoration extends StatefulWidget {
  const ShopDecoration({
    super.key,
    this.topSales,
    this.categoryOfShopDecoration,
    this.listProductsRecommendation,
  });
  final List<Product>? topSales;
  final List<CategoryOfShopDecoration>? categoryOfShopDecoration;
  final List<Product>? listProductsRecommendation;

  @override
  State<ShopDecoration> createState() => _ShopDecorationState();
}

class _ShopDecorationState extends State<ShopDecoration> {
  @override
  Widget build(BuildContext context) {
    final categoryOfShopDecoration = widget.categoryOfShopDecoration;
    return SingleChildScrollView(
      child: Column(
        children: [
          categoryOfShopDecoration != null &&
                  categoryOfShopDecoration.isNotEmpty
              ? ListView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: categoryOfShopDecoration.length,
                  padding: EdgeInsets.zero,
                  itemBuilder: (context, index) {
                    final decoration = categoryOfShopDecoration[index];

                    if (decoration.listProducts!.isEmpty) {
                      return const SizedBox.shrink();
                    }

                    return Column(
                      children: [
                        ProductInterestScroll(
                          title: decoration.name,
                          products: decoration.listProducts!,
                        ),
                        const LineContainer(
                          height: 8,
                        ),
                      ],
                    );
                  },
                )
              : const SizedBox.shrink(),
          const LineContainer(
            height: 8,
          ),
          Container(
            decoration: const BoxDecoration(color: ColorsString.white),
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: Row(
                    children: [
                      Expanded(
                        child: Container(
                          height: 1,
                          color: ColorsString.black,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'You May Also Like',
                        style: TextStyle(
                          color: ColorsString.black,
                          fontSize: Sizes.fontSizeSm,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Container(
                          height: 1,
                          color: ColorsString.black,
                        ),
                      ),
                    ],
                  ),
                ),
                if (widget.listProductsRecommendation!.isNotEmpty)
                  ListProduct(
                    listProduct: widget.listProductsRecommendation!,
                  )
              ],
            ),
          )
        ],
      ),
    );
  }
}
