// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables
import 'package:collection/collection.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:input_quantity/input_quantity.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/common/widgets/button.dart';
import 'package:supershop_app/common/widgets/line_container.dart';
import 'package:supershop_app/common/widgets/rounded_image.dart';
import 'package:supershop_app/features/cart/extendedModel/cart_item_request.dart';
import 'package:supershop_app/features/cart/utils/utils_cart.dart';
import 'package:supershop_app/features/product/components/price_product.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:supershop_app/models/product/product_variant.dart';
import 'package:supershop_app/providers/cart.provider.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/config.dart';
import 'package:supershop_app/utils/constants/sizes.dart';
import 'package:supershop_app/utils/converts/number.dart';

class VariantBotSheet extends StatefulWidget {
  const VariantBotSheet({super.key, required this.id, required this.product, this.productVariant});
  final String id;
  final Product product;
  final ProductVariant? productVariant;

  @override
  State<VariantBotSheet> createState() => _VariantBotSheet();
}

class _VariantBotSheet extends State<VariantBotSheet> {
  late String imageUrlSelected;
  late Widget priceProduct;
  late int stockQuantity;
  String selectedVariant1 = '';
  String selectedVariant2 = '';
  String productVariantId = '';
  String errorUpdateVariant = '';
  @override
  void initState() {
    // TODO: implement initState
    imageUrlSelected = widget.product.productImages[0].imageUrl;
    _handleGenerateData();
    super.initState();
  }

  void _handleAutoPickVariant() {
    print(widget.productVariant?.stockQuantity);
    setState(() {
      String variant1Name = '';
      String variant2Name = '';
      if (widget.product != null && widget.productVariant != null) {
        if (widget.product.productVariants != null && widget.product.productVariants!.isNotEmpty) {
          for (var proVariant in widget.product.productVariants!) {
            if (proVariant.id == widget.productVariant!.id) {
              variant1Name = proVariant.variant1.name;
              selectedVariant1 = proVariant.variant1.id;
              if (proVariant.variant2 != null) {
                variant2Name = proVariant.variant2!.name;
                selectedVariant2 = proVariant.variant2!.id;
              }
            }
          }
        }
      }

      if (widget.product != null) {
        if (selectedVariant1.isNotEmpty || selectedVariant2.isNotEmpty) {
          ProductVariant? getProductVariant() {
            if (widget.product.variantsGroup!.length == 1 && selectedVariant1 != null) {
              return widget.product.productVariants!.firstWhereOrNull(
                (item) => item.variant1.id == selectedVariant1,
              );
            } else if (widget.product.variantsGroup!.length == 2 &&
                selectedVariant1 != null &&
                selectedVariant2 != null) {
              return widget.product.productVariants!.firstWhereOrNull(
                (item) =>
                    item.variant1.id == selectedVariant1 && item.variant2!.id == selectedVariant2,
              );
            }
            return null;
          }

          var productVariantAutoPick = getProductVariant();
          productVariantId = productVariantAutoPick != null ? productVariantAutoPick.id : '';
          if (productVariantAutoPick != null) {
            stockQuantity = productVariantAutoPick.stockQuantity;
            priceProduct = PriceProduct(
              price: productVariantAutoPick.price,
              fontWeight: FontWeight.w700,
              iconSize: Sizes.fontSizeMd,
              textSize: Sizes.fontSizeLg,
            );
          }
        }
      }
    });
  }

  void _handleGenerateData() {
    setState(() {
      if (widget.product.isVariant) {
        stockQuantity = calculateTotalStockQuantity(widget.product.productVariants!);
        double lowestPrice = calculateLowestPrice(widget.product.productVariants!);
        double highestPrice = calculateHighestPrice(widget.product.productVariants!);

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

        _handleAutoPickVariant();
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

  // void _handleSelectedProductVariant() {
  //   if (widget.product.productVariants != null) {
  //     int index = widget.product.productVariants!.indexWhere((pv) {
  //       bool isSelected = true;

  //       if (selectedVariant1.isNotEmpty) {
  //         isSelected = isSelected && pv.variant1.id == selectedVariant1;
  //       } else {
  //         isSelected = isSelected && pv.variant1.id != selectedVariant1;
  //       }

  //       print("isSelected" + "${isSelected}");

  //       if (selectedVariant2.isNotEmpty && pv.variant2 != null) {
  //         isSelected = isSelected && pv.variant2!.id == selectedVariant2;
  //       } else {
  //         isSelected = isSelected && pv.variant2 != null;
  //       }
  //       print("isSelected" + "${isSelected}");

  //       return isSelected;
  //     });

  //     ProductVariant? selected = index != -1 ? widget.product.productVariants![index] : null;
  //     printObject(selected as Object);
  //     print("index: $index");
  //     setState(() {
  //       if (selected != null) {
  //         print(selected.price);
  //         productVariantId = selected.id;
  //         stockQuantity = selected.stockQuantity;
  //         priceProduct = PriceProduct(
  //           price: selected.price,
  //           fontWeight: FontWeight.w700,
  //           iconSize: Sizes.fontSizeMd,
  //           textSize: Sizes.fontSizeLg,
  //         );
  //       } else {
  //         productVariantId = '';
  //         stockQuantity = calculateTotalStockQuantity(widget.product.productVariants!);
  //         _handleGenerateData();
  //       }
  //     });
  //   }
  // }

  void _handleSelectedProductVariant() {
    if (widget.product.productVariants != null) {
      List<ProductVariant>? variantSelected = widget.product.productVariants!.where((pv) {
        bool isSelected = true;
        if (selectedVariant1 != '') {
          isSelected = isSelected && (pv.variant1.id == selectedVariant1);
        }
        if (selectedVariant2 != '' && pv.variant2 != null) {
          isSelected = isSelected && (pv.variant2!.id == selectedVariant2);
        }
        return isSelected;
      }).toList();

      printObject(variantSelected);

      if (selectedVariant1 == '' && selectedVariant2 == '') {
        productVariantId = '';
        stockQuantity = calculateTotalStockQuantity(widget.product.productVariants!);
        _handleGenerateData();
      } else {
        setState(() {
          productVariantId = '';
          if (variantSelected.isNotEmpty) {
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

  bool colorSelected(bool isPrimary, String variantId) {
    if (isPrimary) {
      return selectedVariant1.isNotEmpty && variantId == selectedVariant1;
    } else {
      return selectedVariant2.isNotEmpty && variantId == selectedVariant2;
    }
  }

  void handleUpdateVariant() async {
    print(productVariantId);
    if (productVariantId.isNotEmpty) {
      var cartItemRequest = CartItemRequest(
        id: widget.id,
        shopId: widget.product.shopId,
        productId: widget.product.id,
        productVariantId: productVariantId,
      );
      var res = await Provider.of<CartProvider>(context, listen: false)
          .handleUpdateSelectedVariant(cartItemRequest);
      if (res == "OK") {
        if (mounted) {
          Navigator.pop(context);
          setState(() {
            errorUpdateVariant = '';
          });
        }
      } else {
        setState(() {
          errorUpdateVariant = res;
        });
      }
    }
  }

  bool _unClickButton(
      bool isPrimary, String variantId, String selectedVariant1Id, String selectedVariant2Id) {
    List<ProductVariant> variantsSelected = widget.product.productVariants!.where((pv) {
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
      List<ProductVariant> variants = widget.product.productVariants!.where((pv) {
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
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
        child: Container(
          width: double.infinity,
          color: ColorsString.white,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                child: Stack(
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        RoundedImage(
                          imageUrl: '${Config.awsUrl}products/$imageUrlSelected',
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
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
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
                                height: 2,
                              ),
                              Wrap(
                                spacing: 8.0,
                                runSpacing: 4.0,
                                children: group.variants
                                    .map(
                                      (variant) => GestureDetector(
                                        onTap: _unClickButton(group.isPrimary, variant.id,
                                                selectedVariant1, selectedVariant2)
                                            ? () {
                                                setState(() {
                                                  if (group.isPrimary) {
                                                    if (selectedVariant1 != '' &&
                                                        selectedVariant1 == variant.id) {
                                                      selectedVariant1 = '';
                                                      imageUrlSelected =
                                                          widget.product.productImages[0].imageUrl;
                                                    } else {
                                                      selectedVariant1 = variant.id;
                                                      if (variant.imageUrl != null &&
                                                          variant.imageUrl!.isNotEmpty) {
                                                        imageUrlSelected = variant.imageUrl!;
                                                      }
                                                    }
                                                  } else {
                                                    if (selectedVariant2 != '' &&
                                                        selectedVariant2 == variant.id) {
                                                      selectedVariant2 = '';
                                                    } else {
                                                      selectedVariant2 = variant.id;
                                                    }
                                                  }
                                                });
                                                _handleSelectedProductVariant();
                                              }
                                            : () {},
                                        child: Opacity(
                                          opacity: _unClickButton(group.isPrimary, variant.id,
                                                  selectedVariant1, selectedVariant2)
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
                                              color: colorSelected(group.isPrimary, variant.id)
                                                  ? ColorsString.white
                                                  : ColorsString.buttonBuffer,
                                              borderRadius: BorderRadius.circular(
                                                Sizes.borderRadiusSm,
                                              ),
                                              border: Border.all(
                                                width: 1,
                                                color: colorSelected(group.isPrimary, variant.id)
                                                    ? ColorsString.secondary
                                                    : Colors.transparent,
                                              ),
                                            ),
                                            child: Row(
                                              mainAxisSize: MainAxisSize.min,
                                              mainAxisAlignment: MainAxisAlignment.center,
                                              children: [
                                                if (variant.imageUrl != null)
                                                  RoundedImage(
                                                    imageUrl:
                                                        '${Config.awsUrl}products/${variant.imageUrl}',
                                                    borderRadius: BorderRadius.circular(5),
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
                                                    color: ColorsString.darkerGrey,
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
                              const SizedBox(
                                height: 15,
                              ),
                            ],
                          ),
                        )
                        .toList(),
                  ),
                ),
              errorUpdateVariant.isNotEmpty
                  ? Container(
                      padding: EdgeInsets.only(left: 12),
                      alignment: Alignment.centerLeft, // Aligns the text to the left
                      child: Text(
                        errorUpdateVariant,
                        style: TextStyle(fontSize: 14, color: Colors.red),
                      ),
                    )
                  : Container(),
              const LineContainer(),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
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
                    // InputQty.int(
                    //   maxVal: stockQuantity,
                    //   initVal: (stockQuantity >= 1) ? 1 : stockQuantity,
                    //   minVal: 1,
                    //   steps: 1,
                    //   decoration: const QtyDecorationProps(
                    //     qtyStyle: QtyStyle.classic,
                    //     border: InputBorder.none,
                    //   ),
                    //   onQtyChanged: (val) {
                    //     print(val);
                    //   },
                    // ),
                  ],
                ),
              ),
              const LineContainer(
                height: 8,
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                child: Button(
                  width: double.infinity,
                  height: 45,
                  color: productVariantId != '' ? const Color(0xFFE7611E) : ColorsString.softGrey,
                  borderRadius: BorderRadius.circular(4),
                  child: Text(
                    "Confirm",
                    style: TextStyle(
                      fontSize: Sizes.fontSizeLg,
                      color: productVariantId != '' ? ColorsString.white : ColorsString.darkGrey,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                  onTap: () {
                    handleUpdateVariant();
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
