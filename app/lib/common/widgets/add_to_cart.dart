import 'dart:convert';

import 'package:easy_debounce/easy_debounce.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:input_quantity/input_quantity.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/common/widgets/button.dart';
import 'package:supershop_app/common/widgets/line_container.dart';
import 'package:supershop_app/common/widgets/rounded_image.dart';
import 'package:supershop_app/features/product/components/price_product.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:supershop_app/models/product/product_detail.dart';
import 'package:supershop_app/models/product/product_variant.dart';
import 'package:supershop_app/providers/cart.provider.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/config.dart';
import 'package:supershop_app/utils/constants/sizes.dart';
import 'package:supershop_app/utils/converts/number.dart';

class AddToCart extends StatefulWidget {
  const AddToCart({super.key, required this.action, required this.product});
  final String action;
  final ProductDetailForUser product;

  @override
  State<AddToCart> createState() => _AddToCartState();
}

class _AddToCartState extends State<AddToCart> {
  final TextEditingController _controller = TextEditingController();
  late String title;
  late String imageUrlSelected;
  late Widget priceProduct;
  int stockQuantity = 0;
  String selectedVariant1 = '';
  String selectedVariant2 = '';
  String productVariantId = '';
  int quantity = 1;
  late ProductDetailForUser product;

  @override
  void initState() {
    // TODO: implement initState
    switch (widget.action) {
      case 'addToCart':
        title = "Add to Cart";
        break;
      case 'buyNow':
        title = "Buy Now";
        break;
      default:
    }
    imageUrlSelected = widget.product.productImages[0].imageUrl;
    product = widget.product;
    _handleGenerateData();
    super.initState();
  }

  void _handleGenerateData() {
    setState(() {
      if (widget.product.isVariant) {
        stockQuantity =
            calculateTotalStockQuantity(widget.product.productVariants!);
        double lowestPrice =
            calculateLowestPrice(widget.product.productVariants!);
        double highestPrice =
            calculateHighestPrice(widget.product.productVariants!);

        if (lowestPrice == highestPrice) {
          priceProduct = PriceProduct(
            price: highestPrice,
            fontWeight: FontWeight.w700,
            iconSize: Sizes.fontSizeMd,
            textSize: Sizes.fontSizeLg,
          );
        } else {
          priceProduct = Row(
            children: [
              PriceProduct(
                price: lowestPrice,
                fontWeight: FontWeight.w700,
                iconSize: Sizes.fontSizeMd,
                textSize: Sizes.fontSizeLg,
              ),
              const SizedBox(
                width: 10,
                child: Center(
                  child: Text(
                    '-',
                    style: TextStyle(
                      color: ColorsString.primary,
                      fontSize: Sizes.fontSizeSm,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
              PriceProduct(
                price: highestPrice,
                fontWeight: FontWeight.w700,
                iconSize: Sizes.fontSizeMd,
                textSize: Sizes.fontSizeLg,
              ),
            ],
          );
        }
      } else {
        priceProduct = PriceProduct(
          price: widget.product.price!,
          fontWeight: FontWeight.w700,
          iconSize: Sizes.fontSizeMd,
          textSize: Sizes.fontSizeLg,
        );
      }
    });
  }

  void _handleSelectedProductVariant() {
    if (widget.product.productVariants != null) {
      List<ProductVariant>? variantSelected =
          widget.product.productVariants!.where((pv) {
        bool isSelected = true;
        if (selectedVariant1 != '') {
          isSelected = isSelected && (pv.variant1.id == selectedVariant1);
        }
        if (selectedVariant2 != '' && pv.variant2 != null) {
          isSelected = isSelected && (pv.variant2!.id == selectedVariant2);
        }
        return isSelected;
      }).toList();

      if (selectedVariant1 == '' && selectedVariant2 == '') {
        productVariantId = '';
        stockQuantity =
            calculateTotalStockQuantity(widget.product.productVariants!);
        _handleGenerateData();
      } else {
        setState(() {
          productVariantId = '';
          if (variantSelected.isNotEmpty) {
            quantity = 1;
            var selected = variantSelected.first;
            if (variantSelected.length == 1) {
              productVariantId = selected.id;
            }
            stockQuantity = calculateTotalStockQuantity(variantSelected);
            priceProduct = PriceProduct(
              price: selected.price,
              fontWeight: FontWeight.w700,
              iconSize: Sizes.fontSizeMd,
              textSize: Sizes.fontSizeLg,
            );
          }
        });
      }
    }
  }

  void _handleAddToCart() async {
    if (productVariantId == '') return;
    Map<String, dynamic> body = {
      "quantity": quantity,
      "productVariantId": productVariantId,
      "productId": product.id,
      "shopId": product.shopId,
    };

    final cartProvider = Provider.of<CartProvider>(context, listen: false);
    bool isSuccess = await cartProvider.addToCart(body);

    if (isSuccess) {
      showDialog(
        context: context,
        barrierColor: Colors.transparent,
        builder: (BuildContext context) {
          return const AlertDialog(
            backgroundColor: ColorsString.bgOpacity,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.all(
                Radius.circular(
                  Sizes.borderRadiusMd,
                ),
              ),
            ),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.check_circle,
                  color: ColorsString.white,
                  size: 50,
                ),
                SizedBox(height: 10),
                Text(
                  'Added to cart',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: ColorsString.white,
                  ),
                ),
              ],
            ),
          );
        },
      );

      Future.delayed(const Duration(seconds: 2), () {
        if (Navigator.canPop(context)) {
          Navigator.of(context).pop();
        }
        if (Navigator.canPop(context)) {
          Navigator.of(context).pop();
        }
      });
    }
  }

  bool colorSelected(bool isPrimary, String variantId) {
    if (isPrimary) {
      return selectedVariant1.isNotEmpty && variantId == selectedVariant1;
    } else {
      return selectedVariant2.isNotEmpty && variantId == selectedVariant2;
    }
  }

  int detectChangeFromApi() {
    var oldVal = int.tryParse(_controller.text) ?? 1;
    var newVal = quantity;
    if (oldVal != newVal) {
      _controller.text = newVal.toString();
    }
    return oldVal;
  }

  bool _unClickButton(bool isPrimary, String variantId,
      String selectedVariant1Id, String selectedVariant2Id) {
    List<ProductVariant> variantsSelected =
        widget.product.productVariants!.where((pv) {
      bool isSelected = false;
      if (selectedVariant1Id != '') {
        isSelected = pv.variant1.id == selectedVariant1Id;
      }
      if (selectedVariant2Id != '' && pv.variant2 != null) {
        isSelected = isSelected || pv.variant2!.id == selectedVariant2Id;
      }

      return isSelected;
    }).toList();

    if (variantsSelected.isEmpty) {
      List<ProductVariant> variants =
          widget.product.productVariants!.where((pv) {
        bool isSelected = true;

        if (isPrimary) {
          if (variantId != '') {
            isSelected = pv.variant1.id == variantId;
          }
        } else {
          if (variantId != '' && pv.variant2 != null) {
            isSelected = pv.variant2!.id == variantId;
          }
        }

        return isSelected;
      }).toList();

      return calculateTotalStockQuantity(variants) > 0;
    } else {
      List<ProductVariant> variantSelectedRelate = variantsSelected.where((pv) {
        bool isSelected = false;

        if (isPrimary) {
          if (variantId != '') {
            isSelected = pv.variant1.id == variantId;
          }
        } else {
          if (variantId != '' && pv.variant2 != null) {
            isSelected = pv.variant2!.id == variantId;
          }
        }

        return isSelected;
      }).toList();

      if (variantSelectedRelate.isEmpty) {
        List<ProductVariant> variantsLeft = widget.product.productVariants!
            .where((item) => !variantsSelected.contains(item))
            .toList();
        List<ProductVariant> variantRelate = variantsLeft.where((pv) {
          bool isSelected = false;

          if (isPrimary) {
            if (variantId != '') {
              isSelected = pv.variant1.id == variantId;
            }
          } else {
            if (variantId != '' && pv.variant2 != null) {
              isSelected = pv.variant2!.id == variantId;
            }
          }

          return isSelected;
        }).toList();

        return calculateTotalStockQuantity(variantRelate) > 0;
      } else {
        return calculateTotalStockQuantity(variantSelectedRelate) > 0;
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.75,
      ),
      child: SingleChildScrollView(
        padding:
            EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
        child: Container(
          width: double.infinity,
          color: ColorsString.white,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                child: Stack(
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        RoundedImage(
                          imageUrl:
                              '${Config.awsUrl}products/$imageUrlSelected',
                          borderRadius: BorderRadius.circular(5),
                          isNetworkImage: true,
                          height: 120,
                          width: 120,
                          fit: BoxFit.cover,
                        ),
                        const SizedBox(
                          width: 12,
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            priceProduct,
                            const SizedBox(
                              height: 8,
                            ),
                            Text(
                              "Stock: ${stockQuantity.toString()}",
                              style: const TextStyle(
                                fontSize: Sizes.fontSizeMd,
                                color: ColorsString.darkGrey,
                                fontWeight: FontWeight.w400,
                              ),
                            )
                          ],
                        ),
                      ],
                    ),
                    Positioned(
                      top: 0,
                      right: 12,
                      child: InkWell(
                        onTap: () {
                          Navigator.of(context).pop();
                        },
                        child: const Icon(
                          Icons.close_outlined,
                          size: Sizes.iconMd,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const LineContainer(),
              if (widget.product.variantsGroup != null)
                Container(
                  width: double.infinity,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: widget.product.variantsGroup!
                        .map(
                          (group) => Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                group.name,
                                style: const TextStyle(
                                  fontSize: Sizes.fontSizeSm,
                                  color: ColorsString.darkerGrey,
                                  fontWeight: FontWeight.w400,
                                ),
                              ),
                              const SizedBox(
                                height: 12,
                              ),
                              Wrap(
                                spacing: 8.0,
                                runSpacing: 4.0,
                                children: group.variants
                                    .map(
                                      (variant) => GestureDetector(
                                        onTap: _unClickButton(
                                                group.isPrimary,
                                                variant.id,
                                                selectedVariant1,
                                                selectedVariant2)
                                            ? () {
                                                setState(() {
                                                  if (group.isPrimary) {
                                                    if (selectedVariant1 !=
                                                            '' &&
                                                        selectedVariant1 ==
                                                            variant.id) {
                                                      selectedVariant1 = '';
                                                      imageUrlSelected = widget
                                                          .product
                                                          .productImages[0]
                                                          .imageUrl;
                                                    } else {
                                                      selectedVariant1 =
                                                          variant.id;
                                                      if (variant.imageUrl !=
                                                              null &&
                                                          variant.imageUrl!
                                                              .isNotEmpty) {
                                                        imageUrlSelected =
                                                            variant.imageUrl!;
                                                      }
                                                    }
                                                  } else {
                                                    if (selectedVariant2 !=
                                                            '' &&
                                                        selectedVariant2 ==
                                                            variant.id) {
                                                      selectedVariant2 = '';
                                                    } else {
                                                      selectedVariant2 =
                                                          variant.id;
                                                    }
                                                  }
                                                });
                                                _handleSelectedProductVariant();
                                              }
                                            : () {},
                                        child: Opacity(
                                          opacity: _unClickButton(
                                                  group.isPrimary,
                                                  variant.id,
                                                  selectedVariant1,
                                                  selectedVariant2)
                                              ? 1.0
                                              : 0.55,
                                          child: Container(
                                            height: 35,
                                            constraints: const BoxConstraints(
                                              minWidth: 70,
                                            ),
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 8,
                                            ),
                                            decoration: BoxDecoration(
                                              color: colorSelected(
                                                      group.isPrimary,
                                                      variant.id)
                                                  ? ColorsString.white
                                                  : ColorsString.buttonBuffer,
                                              borderRadius:
                                                  BorderRadius.circular(
                                                Sizes.borderRadiusSm,
                                              ),
                                              border: Border.all(
                                                width: 1,
                                                color: colorSelected(
                                                        group.isPrimary,
                                                        variant.id)
                                                    ? ColorsString.secondary
                                                    : Colors.transparent,
                                              ),
                                            ),
                                            child: Row(
                                              mainAxisSize: MainAxisSize.min,
                                              mainAxisAlignment:
                                                  MainAxisAlignment.center,
                                              children: [
                                                if (variant.imageUrl != null)
                                                  RoundedImage(
                                                    imageUrl:
                                                        '${Config.awsUrl}products/${variant.imageUrl}',
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            5),
                                                    isNetworkImage: true,
                                                    height: 30,
                                                    width: 30,
                                                    fit: BoxFit.cover,
                                                  ),
                                                if (variant.imageUrl != null)
                                                  const SizedBox(width: 8),
                                                Text(
                                                  variant.name,
                                                  style: const TextStyle(
                                                    color:
                                                        ColorsString.darkerGrey,
                                                    fontSize: Sizes.fontSizeXs,
                                                    fontWeight: FontWeight.w400,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ),
                                    )
                                    .toList(),
                              ),
                              if (group.isPrimary)
                                const SizedBox(
                                  height: 12,
                                )
                            ],
                          ),
                        )
                        .toList(),
                  ),
                ),
              const LineContainer(),
              Container(
                margin: const EdgeInsets.only(right: 12),
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "Stock: ${stockQuantity.toString()}",
                        style: const TextStyle(
                          fontSize: 14,
                          color: ColorsString.darkerGrey,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      InputQty.int(
                        maxVal: stockQuantity,
                        initVal: detectChangeFromApi(),
                        minVal: 1,
                        steps: 1,
                        qtyFormProps: QtyFormProps(
                            controller: _controller,
                            keyboardType: TextInputType.number),
                        decoration: QtyDecorationProps(
                          qtyStyle: QtyStyle.classic,
                          border: InputBorder.none,
                          minusBtn: Container(
                            padding: EdgeInsets.all(2),
                            decoration: BoxDecoration(
                              border: Border(
                                right: BorderSide(
                                  color: Colors.grey.shade300,
                                  width: 1,
                                ),
                              ),
                            ),
                            child: Icon(
                              Icons.remove,
                              size: 16,
                              color: Colors.grey.shade700,
                            ),
                          ),
                          plusBtn: Container(
                            padding: EdgeInsets.all(2),
                            decoration: BoxDecoration(
                              border: Border(
                                left: BorderSide(
                                  color: Colors.grey.shade300,
                                  width: 1,
                                ),
                              ),
                            ),
                            child: Icon(
                              Icons.add,
                              size: 16,
                              color: Colors.grey.shade700,
                            ),
                          ),
                        ),
                        onQtyChanged: (val) {
                          setState(() {
                            quantity = val;
                          });
                        },
                      ),
                    ],
                  ),
                ),
              ),
              const LineContainer(
                height: 8,
              ),
              Padding(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                child: Button(
                  width: double.infinity,
                  height: 45,
                  color: productVariantId != ''
                      ? ColorsString.secondary
                      : ColorsString.softGrey,
                  borderRadius: BorderRadius.circular(4),
                  onTap: _handleAddToCart,
                  child: Text(
                    title,
                    style: TextStyle(
                      fontSize: Sizes.fontSizeLg,
                      color: productVariantId != ''
                          ? ColorsString.white
                          : ColorsString.darkGrey,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
