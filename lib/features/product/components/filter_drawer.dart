import 'package:flutter/material.dart';
import 'package:supershop_app/common/widgets/line_container.dart';
import 'package:supershop_app/features/product/components/button_filter.dart';
import 'package:supershop_app/features/product/components/from_to_price_filter.dart';
import 'package:supershop_app/models/category/category.dart';
import 'package:supershop_app/models/params_config.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class FilterDrawer extends StatefulWidget {
  const FilterDrawer({
    super.key,
    required this.listAllCategory,
    required this.params,
    required this.handleFilter,
  });
  final List<Category> listAllCategory;
  final ParamsConfig params;
  final void Function(ParamsConfig) handleFilter;

  @override
  State<FilterDrawer> createState() => _FilterDrawerState();
}

class _FilterDrawerState extends State<FilterDrawer> {
  bool showAll = false;
  late ParamsConfig params;

  @override
  void initState() {
    params = widget.params;
    // TODO: implement initState
    super.initState();
  }

  void _handleApply() {
    widget.handleFilter(params);
    Navigator.of(context).pop();
  }

  void _handleReset() {
    widget.handleFilter(params.copyWith(
      rating_filter: '',
      price_max: '',
      price_min: '',
      condition: '',
    ));
    Navigator.of(context).pop();
  }

  bool _categorySelected(Category category) {
    if (category.parentId == null) {
      return params.category == category.id;
    } else {
      return params.category == '${category.parentId}.${category.id}';
    }
  }

  void _inputFromToPrice(String? minPrice, String? maxPrice) {
    params = params.copyWith(price_min: minPrice);
    params = params.copyWith(price_max: maxPrice);
  }

  @override
  Widget build(BuildContext context) {
    final int itemCount = widget.listAllCategory.length;

    return Drawer(
      backgroundColor: ColorsString.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(8),
          bottomLeft: Radius.circular(8),
        ),
      ),
      child: Column(
        children: <Widget>[
          Container(
            height: 100, // Set the height of the DrawerHeader
            decoration: const BoxDecoration(
              color: ColorsString.lightGrey,
            ),
            child: const Align(
              alignment: Alignment.bottomLeft, // Align text to the bottom
              child: Padding(
                padding: EdgeInsets.only(
                    bottom: 12, left: 8), // Optional: Adjust padding as needed
                child: Text(
                  'Search Filter',
                  style: TextStyle(
                    fontSize: Sizes.fontSizeLg,
                    color: ColorsString.dark,
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                // category
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    children: [
                      const Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'By category',
                          style: TextStyle(
                            fontSize: Sizes.fontSizeMd,
                            color: ColorsString.dark,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      GridView.builder(
                        itemCount: showAll ? itemCount : 4,
                        shrinkWrap: true,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 0, vertical: 0),
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          mainAxisSpacing: Sizes.gridViewSpacing,
                          crossAxisSpacing: Sizes.gridViewSpacing,
                          mainAxisExtent: 40,
                        ),
                        itemBuilder: (_, index) => ButtonFilter(
                          text: widget.listAllCategory[index].name,
                          selected:
                              _categorySelected(widget.listAllCategory[index]),
                          onTap: () {
                            setState(() {
                              if (widget.listAllCategory[index].parentId ==
                                  null) {
                                params = params.copyWith(
                                    category: widget.listAllCategory[index].id);
                              } else {
                                params = params.copyWith(
                                    category:
                                        '${widget.listAllCategory[index].parentId}.${widget.listAllCategory[index].id}');
                              }
                            });
                          },
                        ),
                      ),
                      const SizedBox(height: 4),
                      if (itemCount > 4)
                        InkWell(
                          splashColor: Colors.transparent,
                          highlightColor: Colors.transparent,
                          onTap: () {
                            setState(() {
                              showAll = !showAll;
                            });
                          },
                          child: SizedBox(
                            height: 40,
                            width: double.infinity,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text(
                                  showAll ? 'Show Less' : 'Show More',
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    color: ColorsString.dark,
                                    fontSize: Sizes.fontSizeXs,
                                    fontWeight: FontWeight.w400,
                                  ),
                                ),
                                Icon(
                                  showAll
                                      ? Icons.expand_less_outlined
                                      : Icons.expand_more_outlined,
                                  size: Sizes.iconMd,
                                  color: ColorsString.dark,
                                )
                              ],
                            ),
                          ),
                        )
                    ],
                  ),
                ),
                const LineContainer(),
                Padding(
                  padding: EdgeInsets.all(12),
                  child: Column(
                    children: [
                      const Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Price Range (₫)',
                          style: TextStyle(
                            fontSize: Sizes.fontSizeMd,
                            color: ColorsString.dark,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      FromToPriceFilter(
                        params: params,
                        inputFromToPrice: _inputFromToPrice,
                      )
                    ],
                  ),
                ),
                const LineContainer(),
                // condition
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    children: [
                      const Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Condition',
                          style: TextStyle(
                            fontSize: Sizes.fontSizeMd,
                            color: ColorsString.dark,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: SizedBox(
                              height: 40,
                              child: ButtonFilter(
                                  text: 'New',
                                  selected: params.condition != null &&
                                      params.condition == 'new',
                                  onTap: () {
                                    setState(() {
                                      if (params.condition != null &&
                                          params.condition == 'new') {
                                        params = params.copyWith(condition: '');
                                      } else {
                                        params =
                                            params.copyWith(condition: 'new');
                                      }
                                    });
                                  }),
                            ),
                          ),
                          const SizedBox(
                            width: 8,
                          ),
                          Expanded(
                            child: SizedBox(
                              height: 40,
                              child: ButtonFilter(
                                  text: 'Used',
                                  selected: params.condition != null &&
                                      params.condition == 'used',
                                  onTap: () {
                                    setState(() {
                                      if (params.condition != null &&
                                          params.condition == 'used') {
                                        params = params.copyWith(condition: '');
                                      } else {
                                        params =
                                            params.copyWith(condition: 'used');
                                      }
                                    });
                                  }),
                            ),
                          ),
                        ],
                      )
                    ],
                  ),
                ),
                const LineContainer(),
                // rating star
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    children: [
                      const Align(
                        alignment: Alignment.centerLeft,
                        child: Text(
                          'Condition',
                          style: TextStyle(
                            fontSize: Sizes.fontSizeMd,
                            color: ColorsString.dark,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      GridView.builder(
                        itemCount: 5,
                        shrinkWrap: true,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 0, vertical: 0),
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          mainAxisSpacing: Sizes.gridViewSpacing,
                          crossAxisSpacing: Sizes.gridViewSpacing,
                          mainAxisExtent: 40,
                        ),
                        itemBuilder: (_, index) => ButtonFilter(
                          text: 5 - index == 1
                              ? '${5 - index} Stars'
                              : '${5 - index} Stars & Down',
                          selected: params.rating_filter != null &&
                              params.rating_filter == (5 - index).toString(),
                          onTap: () {
                            setState(() {
                              if (params.rating_filter != null &&
                                  params.rating_filter ==
                                      (5 - index).toString()) {
                                params = params.copyWith(rating_filter: '');
                              } else {
                                params = params.copyWith(
                                    rating_filter: (5 - index).toString());
                              }
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                ),
                const LineContainer(),
              ],
            ),
          ),
          Container(
            height: 60, // Set height of the bottom section
            color: ColorsString.lightGrey,
            padding: const EdgeInsets.all(8),
            child: Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: _handleReset,
                    child: Container(
                      width: double.infinity,
                      height: double.infinity,
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: ColorsString.primary,
                          width: 1,
                        ),
                        borderRadius: const BorderRadius.all(
                          Radius.circular(3),
                        ),
                      ),
                      child: const Align(
                        alignment: Alignment.center,
                        child: Text(
                          'Reset',
                          style: TextStyle(
                            color: ColorsString.primary,
                            fontSize: Sizes.fontSizeMd,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(
                  width: 8,
                ),
                Expanded(
                  child: InkWell(
                    onTap: _handleApply,
                    child: Container(
                      width: double.infinity,
                      height: double.infinity,
                      decoration: const BoxDecoration(
                          borderRadius: BorderRadius.all(
                            Radius.circular(3),
                          ),
                          color: ColorsString.primary),
                      child: const Align(
                        alignment: Alignment.center,
                        child: Text(
                          'Apply',
                          style: TextStyle(
                            color: ColorsString.white,
                            fontSize: Sizes.fontSizeMd,
                            fontWeight: FontWeight.w600,
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
    );
  }
}
