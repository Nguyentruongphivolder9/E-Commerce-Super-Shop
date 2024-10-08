import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/common/screens/loading_screen.dart';
import 'package:supershop_app/common/widgets/build_image_circular.dart';
import 'package:supershop_app/common/widgets/rounded_image.dart';
import 'package:supershop_app/controllers/promo_slider_controller.dart';
import 'package:supershop_app/enums/sort_by.dart';
import 'package:supershop_app/features/product/components/shop_category.dart';
import 'package:supershop_app/features/product/components/shop_decoration.dart';
import 'package:supershop_app/features/product/components/shop_product.dart';
import 'package:supershop_app/models/params_config.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:supershop_app/models/product/product_pagination.dart';
import 'package:supershop_app/models/product/shop_detail_response.dart';
import 'package:supershop_app/providers/product.provider.dart';
import 'package:supershop_app/providers/shop.provider.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';
import 'package:supershop_app/utils/converts/number.dart';

class ShopDetail extends StatefulWidget {
  const ShopDetail({super.key, required this.shopId});
  final String shopId;

  @override
  State<ShopDetail> createState() => _ShopDetailState();
}

class _ShopDetailState extends State<ShopDetail> {
  final controller = Get.put(PromoSliderController());
  final CarouselSliderController _carouselController =
      CarouselSliderController();
  final ValueNotifier<bool> _isCollapsed = ValueNotifier(false);
  final ScrollController _scrollController = ScrollController();
  int currentTabs = 0;
  List<Product> _products = [];
  int _totalPages = 0;
  ShopDetailResponse? _shopDetail;
  ParamsConfig params = ParamsConfig(
      sort_by: SortBy.pop.name, limit: '10', page: '1', rating_filter: '5');

  @override
  void initState() {
    super.initState();
    controller.updateItemIndicatorShopTabs(currentTabs);
    _scrollController.addListener(() {
      if (_scrollController.offset >= (150 - kToolbarHeight)) {
        _isCollapsed.value = true;
      } else {
        _isCollapsed.value = false;
      }
    });
    _getShopDetail(widget.shopId).then((onValue) {
      setState(() {
        _shopDetail = onValue;
      });
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _getListProductsFilter(widget.shopId, params).then((onValue) {
      setState(() {
        _products = onValue?.listProducts ?? [];
        _totalPages = onValue?.totalPages ?? 0;
      });
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<ShopDetailResponse?> _getShopDetail(String shopId) async {
    final shopProvider = context.read<ShopProvider>();
    return await shopProvider.getShopDetail(shopId);
  }

  Future<ProductPagination?> _getListProductsFilter(
      String shopId, ParamsConfig params) async {
    final shopProvider = context.read<ShopProvider>();
    return await shopProvider.getListProductsFilter(shopId, params);
  }

  void _handleFilter(ParamsConfig newParams) async {
    setState(() {
      params = newParams;
    });

    ProductPagination? response =
        await _getListProductsFilter(widget.shopId, newParams);
    if (newParams.page != null && newParams.page == '1') {
      setState(() {
        _products = response?.listProducts ?? [];
      });
    } else {
      setState(() {
        _products.addAll(response?.listProducts ?? []);
      });
    }
  }

  Future _refresh() async {
    _getShopDetail(widget.shopId).then((onValue) {
      setState(() {
        _shopDetail = onValue;
      });
    });
    _getListProductsFilter(widget.shopId, params).then((onValue) {
      setState(() {
        _products = onValue?.listProducts ?? [];
        _totalPages = onValue?.totalPages ?? 0;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final listProductRecommendation =
        Provider.of<ProductProvider>(context).listProductRecommendation;

    return Scaffold(
      body: RefreshIndicator(
        onRefresh: _refresh,
        child: CustomScrollView(
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
                      child: Icon(
                        Icons.arrow_back,
                        color: _isCollapsed.value
                            ? ColorsString.secondary
                            : Colors.white,
                        size: Sizes.iconMd,
                      ),
                    ),
                  );
                },
              ),
              // title: AnimatedBuilder(
              //   animation: _isCollapsed,
              //   builder: (context, child) {
              //     return Container(
              //       height: 35,
              //       decoration: BoxDecoration(
              //         borderRadius: const BorderRadius.all(
              //           Radius.circular(Sizes.borderRadiusSm),
              //         ),
              //         color: _isCollapsed.value
              //             ? Colors.transparent
              //             : ColorsString.bgOpacity,
              //         border: Border.all(
              //           width: 1,
              //           color: _isCollapsed.value
              //               ? ColorsString.secondary
              //               : ColorsString.darkGrey,
              //         ),
              //       ),
              //       child: GestureDetector(
              //         onTap: () {},
              //         child: Padding(
              //           padding: const EdgeInsets.only(
              //               top: 2, right: 2, bottom: 2, left: 6),
              //           child: Row(
              //             children: [
              //               Container(
              //                 height: MediaQuery.of(context).size.height,
              //                 padding: const EdgeInsets.only(right: 8, left: 4),
              //                 child: Center(
              //                   child: Icon(
              //                     Icons.search_outlined,
              //                     color: _isCollapsed.value
              //                         ? ColorsString.secondary
              //                         : ColorsString.white,
              //                     size: Sizes.iconSm,
              //                   ),
              //                 ),
              //               ),
              //               Expanded(
              //                 child: Align(
              //                   alignment: Alignment.centerLeft,
              //                   child: Text(
              //                     'hello con sau',
              //                     style: TextStyle(
              //                         fontSize: 14,
              //                         color: _isCollapsed.value
              //                             ? ColorsString.secondary
              //                             : ColorsString.lightGrey),
              //                   ),
              //                 ),
              //               ),
              //             ],
              //           ),
              //         ),
              //       ),
              //     );
              //   },
              // ),
              expandedHeight: 150,
              pinned: true,
              shadowColor: ColorsString.lightGrey,
              backgroundColor: ColorsString.white,
              surfaceTintColor: ColorsString.white,
              flexibleSpace: FlexibleSpaceBar(
                centerTitle: false,
                expandedTitleScale: 1,
                collapseMode: CollapseMode.pin,
                background: _shopDetail != null
                    ? Stack(
                        children: [
                          Container(
                            height: double.infinity,
                            width: double.infinity,
                            child: Stack(
                              children: [
                                Container(
                                  height: double.infinity,
                                  width: double.infinity,
                                  decoration: const BoxDecoration(
                                    image: DecorationImage(
                                      image: NetworkImage(
                                          'https://down-vn.img.susercontent.com/file/vn-11134233-7qukw-lk2aasxvmn7mdf@resize_w80_nl.webp'),
                                      fit: BoxFit.cover,
                                    ),
                                  ),
                                ),
                                Container(
                                  height: double.infinity,
                                  width: double.infinity,
                                  color: Colors.black.withOpacity(0.5),
                                ),
                              ],
                            ),
                          ),
                          Positioned(
                            top: 100,
                            left: 0,
                            right: 0,
                            child: Container(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 8),
                              height: 70,
                              decoration: const BoxDecoration(
                                  color: Colors.transparent),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  BuildImageCircular(
                                    size: 60,
                                    imageUrl:
                                        _shopDetail!.shopInfo.account.avatarUrl,
                                  ),
                                  Expanded(
                                    child: Container(
                                      margin: const EdgeInsets.symmetric(
                                          horizontal: 10, vertical: 4),
                                      child: Column(
                                        children: [
                                          Row(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              Expanded(
                                                child: Text(
                                                  _shopDetail!.shopInfo.account
                                                      .userName,
                                                  style: const TextStyle(
                                                    fontSize: Sizes.fontSizeMd,
                                                    color: ColorsString.white,
                                                    fontWeight: FontWeight.w700,
                                                  ),
                                                  maxLines: 1,
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                ),
                                              ),
                                              const Icon(
                                                Icons.chevron_right_outlined,
                                                color: ColorsString.white,
                                                size: Sizes.iconMd,
                                              ),
                                            ],
                                          ),
                                          const SizedBox(
                                            height: 8,
                                          ),
                                          Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            children: [
                                              InkWell(
                                                onTap: () {},
                                                child: Container(
                                                  padding: const EdgeInsets
                                                      .symmetric(
                                                      horizontal: 6,
                                                      vertical: 3),
                                                  alignment: Alignment.center,
                                                  decoration: const BoxDecoration(
                                                      borderRadius: BorderRadius
                                                          .all(Radius.circular(Sizes
                                                              .borderRadiusLg)),
                                                      color: ColorsString
                                                          .bgOpacity),
                                                  child: Row(
                                                    children: [
                                                      const Icon(
                                                        Icons.star,
                                                        color:
                                                            ColorsString.star,
                                                        size: Sizes.iconSm,
                                                      ),
                                                      const SizedBox(
                                                        width: 4,
                                                      ),
                                                      Text(
                                                        '${_shopDetail!.shopInfo.ratingStar}/5.0',
                                                        style: const TextStyle(
                                                          fontSize:
                                                              Sizes.fontSizeXs,
                                                          color: ColorsString
                                                              .white,
                                                        ),
                                                      )
                                                    ],
                                                  ),
                                                ),
                                              ),
                                              Container(
                                                margin:
                                                    const EdgeInsets.symmetric(
                                                        horizontal: 8),
                                                height: 15,
                                                width: 1,
                                                color: ColorsString.lightGrey,
                                              ),
                                              Expanded(
                                                child: Text(
                                                  '${formatNumberToSocialStyle(_shopDetail!.shopInfo.followerTotal)} Followers',
                                                  style: const TextStyle(
                                                    fontSize: Sizes.fontSizeXs,
                                                    color: ColorsString.white,
                                                  ),
                                                  maxLines: 1,
                                                  overflow:
                                                      TextOverflow.ellipsis,
                                                ),
                                              )
                                            ],
                                          )
                                        ],
                                      ),
                                    ),
                                  ),
                                  SizedBox(
                                    width: 100,
                                    height: double.infinity,
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        InkWell(
                                          onTap: () {},
                                          child: Container(
                                            width: double.infinity,
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 12,
                                              vertical: 6,
                                            ),
                                            alignment: Alignment.center,
                                            decoration: BoxDecoration(
                                              border: Border.all(
                                                  width: 1,
                                                  color: ColorsString.white),
                                              color: Colors.transparent,
                                              borderRadius:
                                                  const BorderRadius.all(
                                                Radius.circular(
                                                    Sizes.borderRadiusSm),
                                              ),
                                            ),
                                            child: const Row(
                                              children: [
                                                Icon(
                                                  Icons
                                                      .person_add_alt_1_outlined,
                                                  color: ColorsString.white,
                                                  size: Sizes.iconSm,
                                                ),
                                                SizedBox(
                                                  width: 4,
                                                ),
                                                Text(
                                                  'Following',
                                                  style: TextStyle(
                                                    fontSize: Sizes.fontSizeXs,
                                                    color: ColorsString.white,
                                                  ),
                                                )
                                              ],
                                            ),
                                          ),
                                        ),
                                        InkWell(
                                          onTap: () {},
                                          child: Container(
                                            width: double.infinity,
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 12,
                                              vertical: 6,
                                            ),
                                            alignment: Alignment.center,
                                            decoration: BoxDecoration(
                                              border: Border.all(
                                                  width: 1,
                                                  color: ColorsString.white),
                                              color: Colors.transparent,
                                              borderRadius:
                                                  const BorderRadius.all(
                                                Radius.circular(
                                                    Sizes.borderRadiusSm),
                                              ),
                                            ),
                                            child: const Row(
                                              children: [
                                                Icon(
                                                  Icons.chat_outlined,
                                                  color: ColorsString.white,
                                                  size: Sizes.iconSm,
                                                ),
                                                SizedBox(
                                                  width: 4,
                                                ),
                                                Text(
                                                  'Chat',
                                                  style: TextStyle(
                                                    fontSize: Sizes.fontSizeXs,
                                                    color: ColorsString.white,
                                                  ),
                                                )
                                              ],
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  )
                                ],
                              ),
                            ),
                          )
                        ],
                      )
                    : const Center(
                        child: CircularProgressIndicator(),
                      ),
              ),
              actions: [
                AnimatedBuilder(
                  animation: _isCollapsed,
                  builder: (context, child) {
                    return InkWell(
                      onTap: () {},
                      splashColor: Colors.transparent,
                      highlightColor: Colors.transparent,
                      child: Center(
                        child: Container(
                          margin: const EdgeInsets.only(right: 16),
                          child: Center(
                            child: Icon(
                              Icons.more_vert,
                              color: _isCollapsed.value
                                  ? ColorsString.secondary
                                  : Colors.white,
                              size: Sizes.iconLg,
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
            SliverPersistentHeader(
              pinned: true,
              floating: false,
              delegate: _SliverAppBarDelegate(
                minHeight: 40.0,
                maxHeight: currentTabs == 0 ? 40.0 : 40.0,
                child: Column(
                  children: [
                    SizedBox(
                      height: 40,
                      width: double.infinity,
                      child: Row(
                        children: [
                          Expanded(
                            child: InkWell(
                              onTap: () {
                                setState(() {
                                  currentTabs = 0;
                                });
                                _carouselController.animateToPage(
                                  0,
                                  duration: const Duration(milliseconds: 500),
                                  curve: Curves.easeInOut,
                                );
                              },
                              splashColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              child: Center(
                                child: Container(
                                  height: double.infinity,
                                  width: double.infinity,
                                  decoration: BoxDecoration(
                                    color: ColorsString.white,
                                    border: Border(
                                      bottom: BorderSide(
                                        color: currentTabs == 0
                                            ? ColorsString.secondary
                                            : ColorsString.grey,
                                        width: currentTabs == 0 ? 2.0 : 1.0,
                                      ),
                                    ),
                                  ),
                                  child: Center(
                                    child: Text(
                                      'Shop',
                                      style: TextStyle(
                                        color: currentTabs == 0
                                            ? ColorsString.secondary
                                            : ColorsString.dark,
                                        fontSize: Sizes.fontSizeMd,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Expanded(
                            child: InkWell(
                              onTap: () {
                                setState(() {
                                  currentTabs = 1;
                                });
                                _carouselController.animateToPage(
                                  1,
                                  duration: const Duration(milliseconds: 500),
                                  curve: Curves.easeInOut,
                                );
                              },
                              splashColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              child: Center(
                                child: Container(
                                  height: double.infinity,
                                  width: double.infinity,
                                  decoration: BoxDecoration(
                                    color: ColorsString.white,
                                    border: Border(
                                      bottom: BorderSide(
                                        color: currentTabs == 1
                                            ? ColorsString.secondary
                                            : ColorsString.grey,
                                        width: currentTabs == 1 ? 2.0 : 1.0,
                                      ),
                                    ),
                                  ),
                                  child: Center(
                                    child: Text(
                                      'Product',
                                      style: TextStyle(
                                        color: currentTabs == 1
                                            ? ColorsString.secondary
                                            : ColorsString.dark,
                                        fontSize: Sizes.fontSizeMd,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                          Expanded(
                            child: InkWell(
                              onTap: () {
                                setState(() {
                                  currentTabs = 2;
                                });
                                _carouselController.animateToPage(
                                  2,
                                  duration: const Duration(milliseconds: 500),
                                  curve: Curves.easeInOut,
                                );
                              },
                              splashColor: Colors.transparent,
                              highlightColor: Colors.transparent,
                              child: Center(
                                child: Container(
                                  height: double.infinity,
                                  width: double.infinity,
                                  decoration: BoxDecoration(
                                    color: ColorsString.white,
                                    border: Border(
                                      bottom: BorderSide(
                                        color: currentTabs == 2
                                            ? ColorsString.secondary
                                            : ColorsString.grey,
                                        width: currentTabs == 2 ? 2.0 : 1.0,
                                      ),
                                    ),
                                  ),
                                  child: Center(
                                    child: Text(
                                      'Category',
                                      style: TextStyle(
                                        color: currentTabs == 2
                                            ? ColorsString.secondary
                                            : ColorsString.dark,
                                        fontSize: Sizes.fontSizeMd,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            SliverToBoxAdapter(
              child: Align(
                alignment: Alignment.topCenter,
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                  decoration: BoxDecoration(
                    color: ColorsString.white,
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                  child: CarouselSlider(
                    carouselController: _carouselController,
                    options: CarouselOptions(
                      height: MediaQuery.of(context).size.height * 0.7,
                      viewportFraction: 1,
                      initialPage: controller.shopTabsCurrentIndex.value,
                      enableInfiniteScroll: false,
                      reverse: false,
                      autoPlay: false,
                      scrollDirection: Axis.horizontal,
                      onPageChanged: (index, _) {
                        setState(() {
                          currentTabs = index;
                        });
                        controller.updateItemIndicatorShopTabs(index);
                      },
                    ),
                    items: [
                      ShopDecoration(
                        categoryOfShopDecoration: _shopDetail != null
                            ? _shopDetail!.categoryOfShopDecoration ?? []
                            : [],
                        listProductsRecommendation: listProductRecommendation,
                        topSales: _shopDetail != null
                            ? _shopDetail!.topSales ?? []
                            : [],
                      ),
                      ShopProduct(
                        handleFilter: _handleFilter,
                        listProducts: _products,
                        params: params,
                      ),
                      ShopCategory(
                        categories: _shopDetail?.categoryOfShop ?? [],
                      ),
                    ],
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  final double minHeight;
  final double maxHeight;
  final Widget child;

  _SliverAppBarDelegate({
    required this.minHeight,
    required this.maxHeight,
    required this.child,
  });

  @override
  double get minExtent => minHeight;

  @override
  double get maxExtent => maxHeight;

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    return SizedBox.expand(child: child);
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return maxHeight != oldDelegate.maxHeight ||
        minHeight != oldDelegate.minHeight ||
        child != oldDelegate.child;
  }
}
