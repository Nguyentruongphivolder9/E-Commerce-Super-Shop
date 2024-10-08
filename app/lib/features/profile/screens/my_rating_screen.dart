import 'package:flutter/material.dart';
import 'package:supershop_app/features/profile/widgets/card_to_rate.dart';
import 'package:supershop_app/features/profile/widgets/tabs_sort_purchases.dart';
import 'package:supershop_app/features/profile/widgets/tabs_sort_ratings.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class MyRatingScreen extends StatefulWidget {
  const MyRatingScreen({super.key});

  @override
  State<MyRatingScreen> createState() => _MyRatingScreenState();
}

class _MyRatingScreenState extends State<MyRatingScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  Future _refresh() async {}

  @override
  Widget build(BuildContext context) {
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
        title: const Text(
          'My Rating',
          style: TextStyle(
            fontSize: Sizes.fontSizeXl,
            color: ColorsString.dark,
            fontWeight: FontWeight.w400,
          ),
        ),
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
                  child: const TabsSortRatings(),
                ),
                pinned: true,
              ),
              SliverToBoxAdapter(
                child: Container(
                  decoration:
                      const BoxDecoration(color: ColorsString.lightGrey),
                  child: Column(
                    children: [
                      // if (_ratingFigure != null &&
                      //     _paginationRating != null &&
                      //     _paginationRating!.listRatings!.isNotEmpty)
                      ListView.builder(
                        itemCount: 2,
                        shrinkWrap: true,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 0, vertical: 4),
                        physics: const NeverScrollableScrollPhysics(),
                        itemBuilder: (_, index) => const CardToRate(),
                      ),
                      Container(
                        decoration:
                            const BoxDecoration(color: ColorsString.white),
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
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
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
