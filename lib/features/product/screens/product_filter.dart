import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/common/widgets/list_product.dart';
import 'package:supershop_app/enums/sort_by.dart';
import 'package:supershop_app/features/product/components/filter_drawer.dart';
import 'package:supershop_app/features/product/components/sort_list_product.dart';
import 'package:supershop_app/models/category/category.dart';
import 'package:supershop_app/models/params_config.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:supershop_app/providers/category.provider.dart';
import 'package:supershop_app/providers/product.provider.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class ProductFilter extends StatefulWidget {
  const ProductFilter({super.key, required this.parentId});
  final String parentId;

  @override
  State<ProductFilter> createState() => _ProductFilterState();
}

class _ProductFilterState extends State<ProductFilter> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  List<Category> _categories = [];
  List<Product> _products = [];
  ParamsConfig params =
      ParamsConfig(sort_by: SortBy.pop.name, limit: '10', page: '1');

  void _openDrawer() {
    _scaffoldKey.currentState?.openEndDrawer();
  }

  @override
  void initState() {
    params = params.copyWith(category: widget.parentId);
    _getListProductsFilter(params).then((onValue) {
      setState(() {
        _products = onValue;
      });
    });
    // TODO: implement initState
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _getListRelateCategory(widget.parentId).then(
      (onValue) => setState(
        () {
          _categories = onValue;
        },
      ),
    );
  }

  Future _refresh() async {}

  Future<List<Category>> _getListRelateCategory(String parentId) async {
    final categories = context.read<CategoryProvider>();
    return await categories.getListRelateCategory(parentId);
  }

  Future<List<Product>> _getListProductsFilter(ParamsConfig params) async {
    final provider = context.read<ProductProvider>();
    return await provider.getListProductsFilter(params);
  }

  void _handleFilter(ParamsConfig newParams) async {
    setState(() {
      params = newParams;
    });

    if (newParams.price_min != null && newParams.price_max != null) {
      int? minPriceValue = int.tryParse(newParams.price_min!);
      int? maxPriceValue = int.tryParse(newParams.price_max!);

      if (minPriceValue != null && maxPriceValue != null) {
        if (minPriceValue > maxPriceValue) {
          _showPriceErrorSnackbar(
              "Minimum price must be smaller than maximum price!");
          return;
        }
      }
    }

    List<Product> newProducts = await _getListProductsFilter(newParams);
    if (newParams.page != null && newParams.page == '1') {
      setState(() {
        _products = newProducts;
      });
    } else {
      setState(() {
        _products.addAll(newProducts);
      });
    }
  }

  void _showPriceErrorSnackbar(String message) {
    final snackBar = SnackBar(
      content: Center(
        child: Column(
          children: [
            const Icon(
              Icons.warning,
              size: Sizes.iconLg,
              color: ColorsString.white,
            ),
            Text(
              message,
              style: const TextStyle(
                fontSize: Sizes.fontSizeXs,
                color: ColorsString.white,
              ),
            )
          ],
        ),
      ),
      backgroundColor: ColorsString.bgOpacity,
      duration: const Duration(seconds: 2),
    );

    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        shadowColor: ColorsString.grey,
        backgroundColor: ColorsString.white,
        surfaceTintColor: ColorsString.white,
        elevation: 1,
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
        title: Container(
          height: 35,
          decoration: BoxDecoration(
            borderRadius: const BorderRadius.all(
              Radius.circular(Sizes.borderRadiusSm),
            ),
            color: Colors.transparent,
            border: Border.all(width: 1, color: ColorsString.primary),
          ),
          child: GestureDetector(
            onTap: () {},
            child: Padding(
              padding:
                  const EdgeInsets.only(top: 2, right: 2, bottom: 2, left: 6),
              child: Row(
                children: [
                  Container(
                    height: MediaQuery.of(context).size.height,
                    padding: const EdgeInsets.only(right: 8, left: 4),
                    child: const Center(
                      child: Icon(
                        Icons.search_outlined,
                        color: ColorsString.darkGrey,
                        size: Sizes.iconSm,
                      ),
                    ),
                  ),
                  const Expanded(
                    child: Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Super Shop search product',
                        style: TextStyle(
                          fontSize: Sizes.fontSizeSm,
                          color: ColorsString.darkGrey,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        actions: [
          InkWell(
            onTap: _openDrawer,
            splashColor: Colors.transparent,
            highlightColor: Colors.transparent,
            child: const Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Icon(
                  Icons.filter_alt_outlined,
                  color: ColorsString.primary,
                ),
                Text(
                  'Filter',
                  style: TextStyle(
                    fontSize: Sizes.fontSizeXs,
                    color: ColorsString.primary,
                  ),
                ),
                SizedBox(
                  width: 12,
                )
              ],
            ),
          )
        ],
      ),
      endDrawer: FilterDrawer(
        listAllCategory: _categories,
        params: params,
        handleFilter: _handleFilter,
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
                  child: SortListProduct(
                    params: params,
                    handleFilter: _handleFilter,
                  ),
                ),
                pinned: true,
              ),
              SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) => Padding(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    child: ListProduct(
                      listProduct: _products,
                    ),
                  ),
                  childCount: 1,
                ),
              ),
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
