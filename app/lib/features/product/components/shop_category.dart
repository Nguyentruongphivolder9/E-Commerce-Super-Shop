import 'package:flutter/material.dart';
import 'package:supershop_app/common/widgets/line_container.dart';
import 'package:supershop_app/common/widgets/rounded_image.dart';
import 'package:supershop_app/models/category/category_of_shop.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/config.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class ShopCategory extends StatefulWidget {
  const ShopCategory({super.key, this.categories});
  final List<CategoryOfShop>? categories;

  @override
  State<ShopCategory> createState() => _ShopCategoryState();
}

class _ShopCategoryState extends State<ShopCategory> {
  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: GridView.builder(
        itemCount: widget.categories?.length ?? 0,
        shrinkWrap: true,
        padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
        physics: const NeverScrollableScrollPhysics(),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 1,
          mainAxisSpacing: Sizes.gridViewSpacing,
          crossAxisSpacing: Sizes.gridViewSpacing,
          mainAxisExtent: 60,
        ),
        itemBuilder: (_, index) {
          final category = widget.categories![index];
          return InkWell(
            onTap: () {
              // Add your tap logic here, like navigating to category details
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              height: 60,
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          if (category.imageUrl != null)
                            RoundedImage(
                              imageUrl:
                                  '${Config.awsUrl}categories-of-shop/${category.imageUrl!}',
                              borderRadius: BorderRadius.circular(0),
                              isNetworkImage: true,
                              padding: EdgeInsets.zero,
                              height: 40,
                              width: 40,
                              applyImageRadius: false,
                              fit: BoxFit.cover,
                            ),
                          if (category.imageUrl != null)
                            const SizedBox(width: 12),
                          RichText(
                            overflow: TextOverflow.ellipsis,
                            text: TextSpan(
                              text: category.name,
                              style: const TextStyle(
                                fontSize: Sizes.fontSizeSm,
                                color: ColorsString.black,
                              ),
                              children: <TextSpan>[
                                TextSpan(
                                  text: ' (${category.totalProduct})',
                                  style: const TextStyle(
                                    color: ColorsString.darkGrey,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const Icon(
                        Icons.chevron_right_rounded,
                        size: Sizes.iconMd,
                        color: ColorsString.darkGrey,
                      ),
                    ],
                  ),
                  const LineContainer(
                    height: 8,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
