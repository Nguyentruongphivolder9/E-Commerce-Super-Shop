import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter/widgets.dart';
import 'package:provider/provider.dart';
import 'package:qr_code_scanner/qr_code_scanner.dart';
import 'package:supershop_app/common/screens/scanner_qr_screen.dart';
import 'package:supershop_app/common/widgets/line_container.dart';
import 'package:supershop_app/common/widgets/list_product.dart';
import 'package:supershop_app/features/home/widgets/banner_slider.dart';
import 'package:supershop_app/features/home/widgets/category_scroll.dart';
import 'package:supershop_app/features/home/widgets/product_interest_scroll.dart';
import 'package:supershop_app/features/profile/context/profile_context.dart';
import 'package:supershop_app/models/account/account.dart';
import 'package:supershop_app/models/params_config.dart';
import 'package:supershop_app/providers/advertise.provider.dart';
import 'package:supershop_app/providers/category.provider.dart';
import 'package:supershop_app/providers/product.provider.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';
import 'package:supershop_app/utils/database/database_helper.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late Future<void> _fetchProductsFuture;
  late Future<void> _getAccount;
  final ScrollController _scrollController = ScrollController();
  final ValueNotifier<bool> _isCollapsed = ValueNotifier(false);
  late Account account;
  bool isLoadingMore = false;
  int page = 1;

  @override
  void initState() {
    super.initState();
    _fetchProductsFuture = _fetchProducts(page);
    _getAccount = _getAccountFromDb();
    _scrollController.addListener(() {
      if (_scrollController.offset >= (150 - kToolbarHeight)) {
        _isCollapsed.value = true;
      } else {
        _isCollapsed.value = false;
      }
    });
  }

  Future<void> _fetchProducts(int page) async {
    final provider = Provider.of<ProductProvider>(context, listen: false);
    final params = ParamsConfig(page: page.toString());
    await provider.getListProductsRecommendation(params);
  }

  Future<void> _getAccountFromDb() async {
    final profileContext = Provider.of<ProfileContext>(context, listen: false);
  }

  Future _refresh() async {
    final provider = Provider.of<ProductProvider>(context, listen: false);
    final params = ParamsConfig(page: page.toString());
    await provider.getListProductsRecommendation(params);

    final categoryProvider = Provider.of<CategoryProvider>(context);
    await categoryProvider.getListAllCategory();
  }

  @override
  Widget build(BuildContext context) {
    final productProvider = Provider.of<ProductProvider>(context);
    final categories = Provider.of<CategoryProvider>(context).listAllCategory;
    final banners = Provider.of<AdvertiseProvider>(context).listAllAdvertise;

    final profileContext = Provider.of<ProfileContext>(context);
    final account = profileContext.account;
    return Scaffold(
      body: Container(
        color: ColorsString.white,
        height: double.infinity,
        width: double.infinity,
        child: RefreshIndicator(
          onRefresh: _refresh,
          child: CustomScrollView(
            controller: _scrollController,
            physics: const AlwaysScrollableScrollPhysics(),
            slivers: [
              SliverAppBar(
                leading: AnimatedBuilder(
                  animation: _isCollapsed,
                  builder: (context, child) {
                    return InkWell(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (context) => QRScannerScreen()),
                        );
                      },
                      splashColor: Colors.transparent,
                      highlightColor: Colors.transparent,
                      child: Center(
                        child: Container(
                          height: 40,
                          width: 40,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: _isCollapsed.value
                                ? const Color.fromARGB(0, 160, 157, 157)
                                : const Color.fromARGB(91, 66, 65, 65),
                            border: Border.all(
                              color: _isCollapsed.value
                                  ? const Color.fromARGB(0, 208, 202, 202)
                                  : const Color.fromARGB(255, 67, 94, 228),
                              width: 2,
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.2),
                                blurRadius: 4,
                                offset: Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Center(
                            child: Icon(
                              Icons.qr_code_scanner,
                              color: _isCollapsed.value
                                  ? ColorsString.primary
                                  : Colors.white, // Màu biểu tượng
                              size: 24, // Kích thước biểu tượng
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
                title: AnimatedBuilder(
                  animation: _isCollapsed,
                  builder: (context, child) {
                    return Container(
                      height: 35,
                      decoration: BoxDecoration(
                        borderRadius: const BorderRadius.all(
                          Radius.circular(Sizes.borderRadiusSm),
                        ),
                        color: _isCollapsed.value
                            ? Colors.transparent
                            : ColorsString.bgOpacity,
                        border: Border.all(
                          width: 1,
                          color: _isCollapsed.value
                              ? ColorsString.primary
                              : ColorsString.darkGrey,
                        ),
                      ),
                      child: GestureDetector(
                        onTap: () {},
                        child: Padding(
                          padding: const EdgeInsets.only(
                              top: 2, right: 2, bottom: 2, left: 6),
                          child: Row(
                            children: [
                              Container(
                                height: MediaQuery.of(context).size.height,
                                padding:
                                    const EdgeInsets.only(right: 8, left: 4),
                                child: Center(
                                  child: Icon(
                                    Icons.search_outlined,
                                    color: _isCollapsed.value
                                        ? ColorsString.darkGrey
                                        : ColorsString.white,
                                    size: Sizes.iconSm,
                                  ),
                                ),
                              ),
                              Expanded(
                                child: Align(
                                  alignment: Alignment.centerLeft,
                                  child: Text(
                                    'Super Shop E-commerce ',
                                    style: TextStyle(
                                        fontSize: 14,
                                        color: _isCollapsed.value
                                            ? ColorsString.darkGrey
                                            : ColorsString.lightGrey),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
                expandedHeight: 150,
                pinned: true,
                shadowColor: ColorsString.grey,
                backgroundColor: ColorsString.white,
                surfaceTintColor: ColorsString.white,
                flexibleSpace: FlexibleSpaceBar(
                  centerTitle: false,
                  expandedTitleScale: 1,
                  collapseMode: CollapseMode.pin,
                  background: BannerSlider(
                    listBanners: banners,
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
                        child: Container(
                          decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white,
                              border: Border.all(
                                  color: _isCollapsed.value
                                      ? ColorsString.primary
                                      : ColorsString.darkGrey)),
                          height: 35,
                          width: 35,
                          margin: const EdgeInsets.only(right: 8),
                          child: const Center(
                            child: Icon(Icons.person_outline_rounded),
                          ),
                        ),
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
                    if (categories.isNotEmpty)
                      CategoryScroll(
                        categories: categories,
                      ),
                    if (categories.isNotEmpty)
                      const LineContainer(
                        height: 8,
                      ),
                    if (productProvider.listProductInterest.isNotEmpty)
                      Column(
                        children: [
                          ProductInterestScroll(
                            products: productProvider.listProductInterest,
                          ),
                          const LineContainer(
                            height: 8,
                          ),
                        ],
                      ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 8),
                      child: Row(
                        children: [
                          Text(
                            'Daily Discover'.toUpperCase(),
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
                    Container(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: FutureBuilder<void>(
                        future: _fetchProductsFuture,
                        builder: (context, snapshot) {
                          if (snapshot.connectionState ==
                              ConnectionState.waiting) {
                            return const Center(
                                child: CircularProgressIndicator());
                          }
                          if (snapshot.hasError) {
                            print(snapshot.error);
                            return const Center(
                                child: CircularProgressIndicator(
                              backgroundColor: ColorsString.white,
                              color: ColorsString.primary,
                            ));
                          }
                          if (productProvider
                              .listProductRecommendation.isEmpty) {
                            return const Center(
                                child: Text('No products found'));
                          }
                          return ListProduct(
                            listProduct:
                                productProvider.listProductRecommendation,
                          );
                        },
                      ),
                    ),
                    if (isLoadingMore)
                      const SizedBox(
                        height: 50,
                        child: Center(child: CircularProgressIndicator()),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

  // void _scrollController() async {
  //   if (scrollController.position.pixels ==
  //       scrollController.position.maxScrollExtent) {
  //     page = page + 1;
  //     await _fetchProducts(page);
  //   }
  // }
