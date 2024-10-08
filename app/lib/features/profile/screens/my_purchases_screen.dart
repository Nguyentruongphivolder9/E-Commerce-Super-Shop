// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/common/widgets/line_container.dart';
import 'package:supershop_app/features/cart/utils/utils_cart.dart';
import 'package:supershop_app/features/home/screens/home_screens.dart';
import 'package:supershop_app/features/profile/widgets/card_purchase.dart';
import 'package:supershop_app/features/profile/widgets/no_orders.dart';
import 'package:supershop_app/features/profile/widgets/tabs_sort_purchases.dart';
import 'package:supershop_app/features/profile/widgets/tabs_sort_ratings.dart';
import 'package:supershop_app/models/params_config.dart';
import 'package:supershop_app/providers/order.provider.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class MyPurchasesScreens extends StatefulWidget {
  const MyPurchasesScreens({super.key});

  @override
  State<MyPurchasesScreens> createState() => _MyPurchasesScreensState();
}

class _MyPurchasesScreensState extends State<MyPurchasesScreens> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  ParamsConfig params = ParamsConfig(status: "completed");
  @override
  void initState() {
    super.initState();
    _fetOrders();
  }

  Future<void> _fetOrders() async {
    final provider = Provider.of<OrderProvider>(context, listen: false);
    await provider.fetOrders(params);
  }

  Future _refresh() async {
    await _fetOrders();
  }

  void handleOrderStatusChange(ParamsConfig paramsFrom) async {
    setState(() {
      params = paramsFrom;
    });
    await _fetOrders();
  }

  @override
  Widget build(BuildContext context) {
    printObject(Provider.of<OrderProvider>(context, listen: true).listOrders);
    printObject(params);
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        shadowColor: ColorsString.grey,
        backgroundColor: ColorsString.white,
        surfaceTintColor: ColorsString.white,
        leading: InkWell(
          onTap: () {
            Navigator.of(context).pop();
          },
          splashColor: Colors.transparent,
          highlightColor: Colors.transparent,
          child: const Icon(
            Icons.arrow_back,
            color: ColorsString.primary,
            size: Sizes.iconMd,
          ),
        ),
        title: Text(
          'My Purchases',
          style: const TextStyle(
            fontSize: Sizes.fontSizeXl,
            color: ColorsString.dark,
            fontWeight: FontWeight.w400,
          ),
        ),
        actions: [
          InkWell(
            onTap: () {},
            splashColor: Colors.transparent,
            highlightColor: Colors.transparent,
            child: Center(
              child: Container(
                height: 35,
                width: 35,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Stack(
                    clipBehavior: Clip.none,
                    children: [
                      Icon(Icons.message_rounded, color: ColorsString.primary),
                      Positioned(
                        top: -2,
                        left: 12,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 1),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(20),
                            color: ColorsString.secondary,
                          ),
                          alignment: Alignment.center,
                          child: const Text(
                            '12',
                            style: TextStyle(fontSize: 8, color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(
            width: 12,
          )
        ],
      ),
      body: Container(
        height: double.infinity,
        width: double.infinity,
        color: ColorsString.white,
        child: RefreshIndicator(
          onRefresh: _refresh,
          child: CustomScrollView(
            slivers: [
              SliverPersistentHeader(
                delegate: _SliverAppBarDelegate(
                  child: TabsSortPurchases(
                    status: "completed",
                    params: params,
                    handleOrderStatusChange: handleOrderStatusChange,
                  ),
                ),
                pinned: true,
              ),
              SliverToBoxAdapter(
                child: Container(
                  decoration: const BoxDecoration(color: ColorsString.lightGrey),
                  child: Column(
                    children: [
                      // if (_ratingFigure != null &&
                      //     _paginationRating != null &&
                      //     _paginationRating!.listRatings!.isNotEmpty)
                      Consumer<OrderProvider>(
                        builder: (context, orderProvider, child) {
                          final listOrders = orderProvider.listOrders;
                          if (listOrders.isEmpty) {
                            return NoOrders();
                          }
                          return ListView.builder(
                            itemCount: listOrders.length,
                            shrinkWrap: true,
                            padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 4),
                            physics: const NeverScrollableScrollPhysics(),
                            itemBuilder: (context, index) {
                              final orderGroupShop = listOrders[index];
                              return CardPurchase(
                                order: orderGroupShop,
                              );
                            },
                          );
                        },
                      ),
                      Container(
                        decoration: const BoxDecoration(color: ColorsString.white),
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
                      // const ListProduct()
                    ],
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  final Widget child;

  _SliverAppBarDelegate({required this.child});

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return SizedBox.expand(child: child);
  }

  @override
  double get minExtent => 50.0; // You can adjust the min height as needed

  @override
  double get maxExtent => 50.0; // Same as above

  @override
  bool shouldRebuild(covariant SliverPersistentHeaderDelegate oldDelegate) {
    return false;
  }
}
