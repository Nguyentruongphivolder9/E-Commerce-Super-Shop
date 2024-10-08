import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/common/screens/loading_screen.dart';
import 'package:supershop_app/common/screens/not_found_screen.dart';
import 'package:supershop_app/common/widgets/add_to_cart.dart';
import 'package:supershop_app/common/widgets/button.dart';
import 'package:supershop_app/common/widgets/list_product.dart';
import 'package:supershop_app/features/product/components/description_product.dart';
import 'package:supershop_app/common/widgets/line_container.dart';
import 'package:supershop_app/controllers/promo_slider_controller.dart';
import 'package:supershop_app/common/widgets/rounded_image.dart';
import 'package:supershop_app/features/product/components/price_product.dart';
import 'package:supershop_app/features/rating/widgets/rating_container.dart';
import 'package:supershop_app/features/product/components/shop_info.dart';
import 'package:supershop_app/models/image_slider.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:supershop_app/models/product/product_detail.dart';
import 'package:supershop_app/providers/cart.provider.dart';
import 'package:supershop_app/providers/product.provider.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/config.dart';
import 'package:supershop_app/utils/constants/sizes.dart';
import 'package:supershop_app/utils/converts/number.dart';

class ProductDetailScreen extends StatefulWidget {
  const ProductDetailScreen(
      {super.key, required this.productId, required this.shopId});
  final String productId;
  final String shopId;

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  final controller = Get.put(PromoSliderController());
  final CarouselSliderController _carouselController =
      CarouselSliderController();
  final ScrollController _scrollController = ScrollController();
  final ValueNotifier<bool> _isCollapsed = ValueNotifier(false);
  late Widget priceProduct = const PriceProduct(
    price: 0,
    fontWeight: FontWeight.w700,
    iconSize: Sizes.fontSizeXl,
    textSize: Sizes.fontSize2Xl,
  );
  bool isLoading = false;
  List<ImageSlider> imagesSlider = [];
  List<ImageSlider> imagesVariant = [];
  int currentImage = 1;

  @override
  void initState() {
    super.initState();
    _fetchProducts();
    _scrollController.addListener(() {
      if (_scrollController.offset >= (240 - kToolbarHeight)) {
        _isCollapsed.value = true;
      } else {
        _isCollapsed.value = false;
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _isCollapsed.dispose();
    super.dispose();
  }

  void _handleAddToCart(Product product) async {
    Map<String, dynamic> body = {
      "quantity": 1,
      "productVariantId": '',
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

  void _addToCartBottomSheet(String action, ProductDetailForUser product) {
    if (!product.isVariant) {
      _handleAddToCart(product);
    } else {
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(Sizes.borderRadiusLg),
          ),
        ),
        builder: (ctx) => AddToCart(
          action: action,
          product: product,
        ),
      );
    }
    ;
  }

  Future<void> _fetchProducts() async {
    final provider = Provider.of<ProductProvider>(context, listen: false);
    setState(() {
      isLoading = true;
    });
    await provider.getProductDetail(widget.productId, widget.shopId);
    setState(() {
      isLoading = false;
    });
  }

  Future _refresh() async {
    await _fetchProducts();
  }

  @override
  Widget build(BuildContext context) {
    final product = Provider.of<ProductProvider>(context).product;
    final listProductRecommendation =
        Provider.of<ProductProvider>(context).listProductRecommendation;
    final countCartItem =
        Provider.of<CartProvider>(context).listCartItem.length;
    if (isLoading) {
      return const LoadingScreen();
    }

    if (!isLoading && product == null) {
      return const NotFoundScreen();
    }

    if (!isLoading && product != null) {
      setState(() {
        List<ImageSlider> listImage = [];
        product.productImages.asMap().forEach((index, item) {
          listImage.add(ImageSlider(
            index: index,
            imageUrl: '${Config.awsUrl}products/${item.imageUrl}',
            isOutOfStock:
                product.stockQuantity != null && product.stockQuantity! > 0
                    ? true
                    : false,
          ));
        });
        imagesSlider = listImage;

        if (product.isVariant) {
          double lowestPrice = calculateLowestPrice(product.productVariants!);
          double highestPrice = calculateHighestPrice(product.productVariants!);

          int indexStart = listImage.length;
          List<ImageSlider> listImageVariant = [];
          product.variantsGroup?.first.variants.asMap().forEach((index, item) {
            final imageUrl = item.imageUrl;
            if (imageUrl?.isNotEmpty ?? false) {
              final inStockVariants = product.productVariants
                      ?.where((pv) => pv.variant1.id == item.id)
                      .toList() ??
                  [];

              listImageVariant.add(ImageSlider(
                index: index + indexStart,
                imageUrl: '${Config.awsUrl}products/$imageUrl',
                isOutOfStock: calculateTotalStockQuantity(inStockVariants) < 0,
              ));
            }
          });
          imagesVariant = listImageVariant;
          imagesSlider.addAll(listImageVariant);

          if (lowestPrice == highestPrice) {
            priceProduct = PriceProduct(
              price: highestPrice,
              fontWeight: FontWeight.w700,
              iconSize: Sizes.fontSizeXl,
              textSize: Sizes.fontSize2Xl,
            );
          } else {
            priceProduct = Row(
              children: [
                PriceProduct(
                  price: lowestPrice,
                  fontWeight: FontWeight.w700,
                  iconSize: Sizes.fontSizeXl,
                  textSize: Sizes.fontSize2Xl,
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
                  iconSize: Sizes.fontSizeXl,
                  textSize: Sizes.fontSize2Xl,
                ),
              ],
            );
          }
        } else {
          priceProduct = PriceProduct(
            price: product.price!,
            fontWeight: FontWeight.w700,
            iconSize: Sizes.fontSizeXl,
            textSize: Sizes.fontSize2Xl,
          );
        }
      });
    }

    return Scaffold(
      body: CustomScrollView(
        controller: _scrollController,
        slivers: [
          SliverAppBar(
            leading: AnimatedBuilder(
              animation: _isCollapsed,
              builder: (context, child) {
                return InkWell(
                  onTap: () {
                    Navigator.of(context).pop();
                  },
                  splashColor: Colors.transparent,
                  highlightColor: Colors.transparent,
                  child: Center(
                      child: Container(
                    height: 35,
                    width: 35,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _isCollapsed.value
                          ? Colors.transparent
                          : ColorsString.bgOpacity,
                    ),
                    child: Center(
                      child: Icon(
                        Icons.arrow_back,
                        color: _isCollapsed.value
                            ? ColorsString.primary
                            : Colors.white,
                        size: Sizes.iconMd,
                      ),
                    ),
                  )),
                );
              },
            ),
            title: AnimatedBuilder(
                animation: _isCollapsed,
                builder: (context, child) {
                  return Text(
                    "Product detail",
                    style: TextStyle(
                        fontSize: Sizes.fontSizeXl,
                        color: _isCollapsed.value
                            ? ColorsString.primary
                            : Colors.transparent,
                        fontWeight: FontWeight.w500),
                  );
                }),
            expandedHeight: 300,
            pinned: true,
            shadowColor: ColorsString.grey,
            backgroundColor: ColorsString.white,
            surfaceTintColor: ColorsString.white,
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: false,
              expandedTitleScale: 1,
              collapseMode: CollapseMode.pin,
              background: Stack(
                clipBehavior: Clip.none,
                children: [
                  CarouselSlider(
                    carouselController: _carouselController,
                    options: CarouselOptions(
                      height: double.infinity,
                      viewportFraction: 1,
                      initialPage: controller.productImageCurrentIndex.value,
                      enableInfiniteScroll: true,
                      reverse: false,
                      autoPlay: false,
                      scrollDirection: Axis.horizontal,
                      onPageChanged: (index, _) => {
                        setState(() {
                          currentImage = index + 1;
                        }),
                        controller.updateItemIndicatorProductImage(index)
                      },
                    ),
                    items: imagesSlider
                        .map(
                          (image) => Stack(
                            children: [
                              RoundedImage(
                                imageUrl: image.imageUrl,
                                borderRadius: BorderRadius.circular(0),
                                isNetworkImage: true,
                                padding: EdgeInsets.zero,
                                height: double.infinity,
                                width: double.infinity,
                                applyImageRadius: false,
                                fit: BoxFit.cover,
                              ),
                              if (image.isOutOfStock)
                                Positioned(
                                  bottom: 0,
                                  right: 0,
                                  left: 0,
                                  top: 0,
                                  child: Container(
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(10),
                                      color: ColorsString.bgOpacity,
                                    ),
                                    alignment: Alignment.center,
                                    child: const Text(
                                      'Sold Out',
                                      style: TextStyle(
                                          fontSize: Sizes.fontSizeMd,
                                          color: ColorsString.white,
                                          fontWeight: FontWeight.bold),
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        )
                        .toList(),
                  ),
                  Positioned(
                    bottom: 12,
                    right: 16,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        color: ColorsString.lightGrey,
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        '${currentImage}/${imagesSlider.length}',
                        style: const TextStyle(
                          fontSize: Sizes.fontSizeSm,
                          color: ColorsString.darkerGrey,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            actions: [
              AnimatedBuilder(
                animation: _isCollapsed,
                builder: (context, child) {
                  return InkWell(
                    onTap: () {
                      Navigator.pushNamed(context, '/cart');
                    },
                    splashColor: Colors.transparent,
                    highlightColor: Colors.transparent,
                    child: Center(
                        child: Container(
                      height: 35,
                      width: 35,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _isCollapsed.value
                            ? Colors.transparent
                            : ColorsString.bgOpacity,
                      ),
                      child: Center(
                        child: Stack(
                          clipBehavior: Clip.none,
                          children: [
                            Icon(
                              Icons.shopping_cart_outlined,
                              color: _isCollapsed.value
                                  ? ColorsString.primary
                                  : Colors.white,
                            ),
                            Positioned(
                              top: -2,
                              left: 12,
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 4, vertical: 1),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(20),
                                  color: ColorsString.secondary,
                                ),
                                alignment: Alignment.center,
                                child: Text(
                                  countCartItem.toString(),
                                  style: const TextStyle(
                                    fontSize: 8,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    )),
                  );
                },
              ),
              const SizedBox(
                width: 12,
              ),
              AnimatedBuilder(
                animation: _isCollapsed,
                builder: (context, child) {
                  return InkWell(
                    onTap: () {},
                    splashColor: Colors.transparent,
                    highlightColor: Colors.transparent,
                    child: Center(
                        child: Container(
                      height: 35,
                      width: 35,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _isCollapsed.value
                            ? Colors.transparent
                            : ColorsString.bgOpacity,
                      ),
                      child: Center(
                        child: Icon(
                          Icons.more_vert,
                          color: _isCollapsed.value
                              ? ColorsString.primary
                              : Colors.white,
                          size: Sizes.iconMd,
                        ),
                      ),
                    )),
                  );
                },
              ),
              const SizedBox(
                width: 12,
              ),
            ],
          ),
          SliverToBoxAdapter(
            child: Column(
              children: [
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(colors: [
                      Color.fromARGB(255, 249, 249, 244),
                      Color.fromARGB(255, 246, 234, 244)
                    ]),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.max,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(
                        height: 5,
                      ),
                      if (imagesVariant.isNotEmpty)
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '${imagesVariant.length} Variations Available',
                              style: const TextStyle(
                                fontSize: Sizes.fontSizeXs,
                                color: ColorsString.textSecondary,
                              ),
                            ),
                            const SizedBox(
                              height: 5,
                            ),
                            SingleChildScrollView(
                              scrollDirection: Axis.horizontal,
                              child: Row(
                                children: imagesVariant
                                    .map((image) => InkWell(
                                          onTap: image.isOutOfStock
                                              ? null
                                              : () {
                                                  setState(() {
                                                    controller
                                                        .updateItemIndicatorProductImage(
                                                            image.index);
                                                    _carouselController
                                                        .jumpToPage(
                                                            image.index);
                                                  });
                                                },
                                          child: Opacity(
                                            opacity:
                                                image.isOutOfStock ? 0.5 : 1.0,
                                            child: Container(
                                              height: 50,
                                              width: 50,
                                              margin: const EdgeInsets.only(
                                                  right: 6),
                                              decoration: BoxDecoration(
                                                border: Border.all(
                                                  width: 1,
                                                  color: ColorsString.grey,
                                                ),
                                                borderRadius:
                                                    BorderRadius.circular(5),
                                              ),
                                              child: RoundedImage(
                                                imageUrl: image.imageUrl,
                                                borderRadius:
                                                    BorderRadius.circular(5),
                                                isNetworkImage: true,
                                                height: double.infinity,
                                                width: double.infinity,
                                                fit: BoxFit.cover,
                                              ),
                                            ),
                                          ),
                                        ))
                                    .toList(),
                              ),
                            ),
                            const SizedBox(
                              height: 8,
                            ),
                          ],
                        ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: [
                          priceProduct
                          // Row(
                          //   children: [
                          //     Text(
                          //       'Sold ${formatNumberToSocialStyle(product!.productFigure.sold)}',
                          //       overflow: TextOverflow.ellipsis,
                          //       style: const TextStyle(
                          //         color: ColorsString.black,
                          //         fontSize: Sizes.fontSizeXs,
                          //         fontWeight: FontWeight.w500,
                          //       ),
                          //     ),
                          //     const SizedBox(
                          //       width: 2,
                          //     ),
                          //     Button(
                          //       height: 20,
                          //       width: 20,
                          //       onTap: () {},
                          //       child: const Icon(
                          //         Icons.favorite_border_outlined,
                          //         size: Sizes.fontSizeMd,
                          //       ),
                          //     ),
                          //   ],
                          // ),
                        ],
                      ),
                      const SizedBox(
                        height: 8,
                      ),
                      Text(
                        product!.name,
                        maxLines: 2,
                        style: const TextStyle(
                            color: ColorsString.black,
                            fontSize: Sizes.fontSizeSm),
                      ),
                      const SizedBox(
                        height: 7,
                      ),
                    ],
                  ),
                ),
                ShopInfo(
                  sellerInfo: product.seller,
                ),
                const LineContainer(
                  height: 8,
                ),
                DescriptionProduct(
                  product: product,
                ),
                const LineContainer(
                  height: 8,
                ),
                RatingContainer(
                  productFigure: product.productFigure,
                  productId: product.id,
                ),
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
                      if (listProductRecommendation.isNotEmpty)
                        ListProduct(
                          listProduct: listProductRecommendation,
                        )
                    ],
                  ),
                )
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: SizedBox(
        height: 50,
        width: double.infinity,
        child: Row(
          children: [
            Expanded(
                child: Row(
              children: [
                Expanded(
                  child: Button(
                    onTap: () {},
                    color: ColorsString.buttonPrimary,
                    height: double.infinity,
                    width: double.infinity,
                    child: const Icon(
                      Icons.chat_outlined,
                      color: ColorsString.white,
                    ),
                  ),
                ),
                Container(
                  width: 1,
                  height: double.infinity,
                  decoration: const BoxDecoration(
                    color: ColorsString.textSecondary,
                  ),
                ),
                Expanded(
                  child: Button(
                    onTap: () => _addToCartBottomSheet('addToCart', product),
                    color: ColorsString.buttonPrimary,
                    height: double.infinity,
                    width: double.infinity,
                    child: const Icon(
                      Icons.add_shopping_cart_outlined,
                      color: ColorsString.white,
                    ),
                  ),
                ),
              ],
            )),
            Expanded(
              child: Button(
                onTap: () => _addToCartBottomSheet('buyNow', product),
                color: ColorsString.secondary,
                height: double.infinity,
                width: double.infinity,
                child: const Center(
                  child: Text(
                    'Buy Now',
                    style: TextStyle(
                      color: ColorsString.white,
                      fontSize: Sizes.fontSizeMd,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
