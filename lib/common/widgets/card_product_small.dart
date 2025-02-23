import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:supershop_app/common/widgets/rounded_image.dart';
import 'package:supershop_app/features/product/components/price_product.dart';
import 'package:supershop_app/features/product/screens/product_detail.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/config.dart';
import 'package:supershop_app/utils/constants/shadow_style.dart';
import 'package:supershop_app/utils/constants/sizes.dart';
import 'package:supershop_app/utils/converts/number.dart';

class CardProductSmall extends StatefulWidget {
  const CardProductSmall({super.key, required this.product});

  final Product product;

  @override
  State<CardProductSmall> createState() => _CardProductSmallState();
}

class _CardProductSmallState extends State<CardProductSmall> {
  late Widget priceProduct;
  @override
  void initState() {
    // TODO: implement initState
    if (widget.product.isVariant) {
      double lowestPrice =
          calculateLowestPrice(widget.product.productVariants!);

      priceProduct = PriceProduct(
        price: lowestPrice,
        fontWeight: FontWeight.w500,
        iconSize: Sizes.fontSizeXs,
        textSize: Sizes.fontSizeMd,
      );
    } else {
      priceProduct = PriceProduct(
        price: widget.product.price!,
        fontWeight: FontWeight.w500,
        iconSize: Sizes.fontSizeXs,
        textSize: Sizes.fontSizeMd,
      );
    }
    super.initState();
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
              height: 130,
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
                      Row(
                        children: [
                          const Icon(
                            Icons.star,
                            color: ColorsString.star,
                            size: Sizes.iconSm,
                          ),
                          const SizedBox(
                            width: 4,
                          ),
                          Text(
                            '${widget.product.productFigure.ratingStar}/5.0',
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: Sizes.fontSizeXs,
                            ),
                          ),
                        ],
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
