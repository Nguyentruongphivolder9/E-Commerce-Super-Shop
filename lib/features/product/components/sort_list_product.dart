import 'package:flutter/material.dart';
import 'package:supershop_app/enums/order_by.dart';
import 'package:supershop_app/enums/sort_by.dart';
import 'package:supershop_app/models/params_config.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/shadow_style.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class SortListProduct extends StatefulWidget {
  const SortListProduct(
      {super.key, required this.params, required this.handleFilter});
  final ParamsConfig params;
  final void Function(ParamsConfig) handleFilter;

  @override
  State<SortListProduct> createState() => _SortListProductState();
}

class _SortListProductState extends State<SortListProduct> {
  late ParamsConfig params;

  @override
  void initState() {
    params = widget.params;
    // TODO: implement initState
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      width: double.infinity,
      height: 40,
      decoration: const BoxDecoration(
        boxShadow: [ShadowStyle.verticalProductShadow],
        color: ColorsString.white,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            child: InkWell(
              onTap: () {
                setState(() {
                  params = params.copyWith(sort_by: SortBy.pop.name, order: '');
                });
                widget.handleFilter(params);
              },
              splashColor: Colors.transparent,
              highlightColor: Colors.transparent,
              child: Center(
                child: Text(
                  'Popular',
                  style: TextStyle(
                    color: params.sort_by != null &&
                            params.sort_by! == SortBy.pop.name
                        ? ColorsString.primary
                        : ColorsString.darkGrey,
                    fontSize: Sizes.fontSizeSm,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
          ),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 8),
            height: 15,
            width: 1,
            color: ColorsString.darkGrey,
          ),
          Expanded(
            child: InkWell(
              onTap: () {
                setState(() {
                  params =
                      params.copyWith(sort_by: SortBy.ctime.name, order: '');
                });
                widget.handleFilter(params);
              },
              splashColor: Colors.transparent,
              highlightColor: Colors.transparent,
              child: Center(
                child: Text(
                  'New',
                  style: TextStyle(
                    color: params.sort_by != null &&
                            params.sort_by! == SortBy.ctime.name
                        ? ColorsString.primary
                        : ColorsString.darkGrey,
                    fontSize: Sizes.fontSizeSm,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
          ),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 8),
            height: 15,
            width: 1,
            color: ColorsString.darkGrey,
          ),
          Expanded(
            child: InkWell(
              onTap: () {
                setState(() {
                  params =
                      params.copyWith(sort_by: SortBy.sales.name, order: '');
                });
                widget.handleFilter(params);
              },
              splashColor: Colors.transparent,
              highlightColor: Colors.transparent,
              child: Center(
                child: Text(
                  'Top Sales',
                  style: TextStyle(
                    color: params.sort_by != null &&
                            params.sort_by! == SortBy.sales.name
                        ? ColorsString.primary
                        : ColorsString.darkGrey,
                    fontSize: Sizes.fontSizeSm,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
          ),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 8),
            height: 15,
            width: 1,
            color: ColorsString.darkGrey,
          ),
          Expanded(
            child: InkWell(
              onTap: () {
                setState(() {
                  if (params.sort_by != null) {
                    if (params.sort_by != SortBy.price.name) {
                      params = params.copyWith(
                          sort_by: SortBy.price.name, order: OrderBy.desc.name);
                    } else {
                      if (params.order != null) {
                        params = params.copyWith(
                            order: params.order == OrderBy.asc.name
                                ? OrderBy.desc.name
                                : OrderBy.asc.name);
                      }
                    }
                  } else {
                    params = params.copyWith(
                        sort_by: SortBy.price.name, order: OrderBy.desc.name);
                  }
                });
                widget.handleFilter(params);
              },
              splashColor: Colors.transparent,
              highlightColor: Colors.transparent,
              child: Center(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Price',
                      style: TextStyle(
                        color: params.sort_by != null &&
                                params.sort_by! == SortBy.price.name
                            ? ColorsString.primary
                            : ColorsString.darkGrey,
                        fontSize: Sizes.fontSizeSm,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    SizedBox(
                      width: 4,
                    ),
                    SizedBox(
                      height: 25,
                      child: Stack(
                        alignment: Alignment.topCenter,
                        children: [
                          Positioned(
                            // bottom: 5,
                            child: Icon(
                              Icons.expand_less_outlined,
                              size: Sizes.iconSm,
                              color: params.order != null &&
                                      params.order! == OrderBy.asc.name
                                  ? ColorsString.primary
                                  : ColorsString.darkGrey,
                            ),
                          ),
                          Positioned(
                            bottom: 0,
                            child: Icon(
                              Icons.expand_more_outlined,
                              size: Sizes.iconSm,
                              color: params.order != null &&
                                      params.order! == OrderBy.desc.name
                                  ? ColorsString.primary
                                  : ColorsString.darkGrey,
                            ),
                          ),
                        ],
                      ),
                    )
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
