import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:supershop_app/common/widgets/star_rating.dart';
import 'package:supershop_app/common/widgets/rounded_image.dart';
import 'package:supershop_app/features/product/components/price_product.dart';
import 'package:supershop_app/features/product/screens/product_detail.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/config.dart';
import 'package:supershop_app/utils/constants/shadow_style.dart';
import 'package:supershop_app/utils/constants/sizes.dart';
import 'package:supershop_app/utils/converts/number.dart';

class CardProduct extends StatefulWidget {
  const CardProduct({super.key, required this.product});

  final Product product;

  @override
  State<CardProduct> createState() => _CardProductState();
}

class _CardProductState extends State<CardProduct> {
  late Widget priceProduct;

  @override
  void initState() {
    super.initState();
    // Tính toán giá ban đầu
    priceProduct = buildPriceProduct();
  }

// Hàm xây dựng `priceProduct` dựa trên giá
  Widget buildPriceProduct() {
    if (widget.product.isVariant) {
      double lowestPrice =
          calculateLowestPrice(widget.product.productVariants!);
      double highestPrice =
          calculateHighestPrice(widget.product.productVariants!);

      if (lowestPrice == highestPrice) {
        return PriceProduct(
          price: highestPrice,
          fontWeight: FontWeight.w500,
          iconSize: Sizes.fontSizeXs,
          textSize: Sizes.fontSizeMd,
        );
      } else {
        return Row(
          children: [
            PriceProduct(
              price: lowestPrice,
              fontWeight: FontWeight.w500,
              iconSize: Sizes.fontSizeXs,
              textSize: Sizes.fontSizeMd,
            ),
          ],
        );
      }
    } else {
      return PriceProduct(
        price: widget.product.price!,
        fontWeight: FontWeight.w500,
        iconSize: Sizes.fontSizeXs,
        textSize: Sizes.fontSizeMd,
      );
    }
  }

  @override
  void didUpdateWidget(covariant CardProduct oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.product != oldWidget.product ||
        widget.product.productVariants != oldWidget.product.productVariants) {
      setState(() {
        priceProduct = buildPriceProduct();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (ctx) => ProductDetailScreen(
              productId: widget.product.id,
              shopId: widget.product.shopId,
            ),
          ),
        );
      },
      child: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          boxShadow: const [ShadowStyle.verticalProductShadow],
          borderRadius: BorderRadius.circular(Sizes.borderRadiusMd),
          color: ColorsString.white,
        ),
        child: Column(
          children: [
            Container(
              height: 160,
              decoration: const BoxDecoration(
                borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(Sizes.borderRadiusMd),
                    topRight: Radius.circular(Sizes.borderRadiusMd)),
              ),
              child: Stack(
                children: [
                  RoundedImage(
                    imageUrl:
                        "${Config.awsUrl}products/${widget.product.productImages.firstWhere((image) => image.isPrimary).imageUrl}",
                    isNetworkImage: true,
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(Sizes.borderRadiusMd),
                      topRight: Radius.circular(Sizes.borderRadiusMd),
                    ),
                    height: double.maxFinite,
                    width: double.maxFinite,
                    fit: BoxFit.cover,
                  ),
                  // Positioned(
                  //   top: 0,
                  //   right: 0,
                  //   child: Container(
                  //     decoration: BoxDecoration(
                  //         borderRadius: BorderRadius.circular(Sizes.xs),
                  //         color: ColorsString.secondary),
                  //     padding: const EdgeInsets.symmetric(
                  //         horizontal: Sizes.sm, vertical: Sizes.xs),
                  //     child: const Text(
                  //       '-25%',
                  //       style: TextStyle(
                  //         fontSize: Sizes.fontSizeXs,
                  //         fontWeight: FontWeight.w500,
                  //       ),
                  //     ),
                  //   ),
                  // )
                ],
              ),
            ),

            // detail
            Padding(
              padding: const EdgeInsets.all(8),
              child: Column(
                children: [
                  Text(
                    widget.product.name,
                    style: const TextStyle(
                      fontSize: Sizes.fontSizeSm,
                      height: 1.2,
                    ),
                    overflow: TextOverflow.ellipsis,
                    maxLines: 2,
                    textAlign: TextAlign.left,
                  ),
                  const SizedBox(
                    height: 8,
                  ),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [priceProduct],
                  ),
                  const SizedBox(
                    height: 4,
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      StarRating(
                        rating: widget.product.productFigure.ratingStar,
                        size: Sizes.fontSizeSm,
                        activeColor: ColorsString.star,
                        nonActiveColor: ColorsString.grey,
                      ),
                      Text(
                        'Sold ${formatNumberToSocialStyle(widget.product.productFigure.sold)}',
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: Sizes.fontSizeXs,
                        ),
                      ),
                    ],
                  )
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
