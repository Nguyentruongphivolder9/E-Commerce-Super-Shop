import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/common/widgets/line_container.dart';
import 'package:supershop_app/features/rating/widgets/rating_detail.dart';
import 'package:supershop_app/common/widgets/star_rating.dart';
import 'package:supershop_app/models/params_config.dart';
import 'package:supershop_app/models/product/product_figure.dart';
import 'package:supershop_app/models/rating/pagination_rating.dart';
import 'package:supershop_app/models/rating/rating_figure.dart';
import 'package:supershop_app/providers/rating.provider.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class RatingContainer extends StatefulWidget {
  const RatingContainer(
      {super.key, required this.productFigure, required this.productId});
  final ProductFigure productFigure;
  final String productId;

  @override
  State<RatingContainer> createState() => _RatingContainerState();
}

class _RatingContainerState extends State<RatingContainer> {
  RatingFigure? _ratingFigure;
  PaginationRating? _paginationRating;
  int page = 1;

  @override
  void initState() {
    _getRatingFigure(widget.productId).then((value) => {
          setState(() {
            _ratingFigure = value;
          })
        });
    _getListRatings(widget.productId, ParamsConfig(page: '1', limit: '5'))
        .then((value) => {
              setState(() {
                _paginationRating = value;
              })
            });
    // TODO: implement initState
    super.initState();
  }

  Future<RatingFigure?> _getRatingFigure(String productId) async {
    final provider = Provider.of<RatingProvider>(context, listen: false);
    return await provider.getRatingFigure(productId);
  }

  Future<PaginationRating?> _getListRatings(
      String productId, ParamsConfig params) async {
    final provider = Provider.of<RatingProvider>(context, listen: false);
    return await provider.getListRatings(productId, params);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 10),
          height: 60,
          color: ColorsString.white,
          child: InkWell(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Product reviews',
                      style: TextStyle(
                        fontSize: Sizes.fontSizeSm,
                        fontWeight: FontWeight.w500,
                        color: ColorsString.black,
                      ),
                    ),
                    Row(
                      children: [
                        StarRating(
                          rating: widget.productFigure.ratingStar,
                          size: Sizes.fontSizeSm,
                          activeColor: ColorsString.star,
                          nonActiveColor: ColorsString.grey,
                        ),
                        const SizedBox(
                          width: 8,
                        ),
                        Text(
                          '${widget.productFigure.ratingStar}/5',
                          style: const TextStyle(
                            color: ColorsString.primary,
                            fontSize: Sizes.fontSizeXs,
                          ),
                        ),
                        Text(
                          '(${widget.productFigure.totalRatings} đánh giá)',
                          style: const TextStyle(
                            color: ColorsString.darkGrey,
                            fontSize: Sizes.fontSizeXs,
                          ),
                        )
                      ],
                    )
                  ],
                ),
                const Row(
                  children: [
                    Text(
                      'View all',
                      style: TextStyle(
                        color: ColorsString.primary,
                        fontSize: Sizes.fontSizeSm,
                      ),
                    ),
                    Icon(
                      Icons.chevron_right_outlined,
                      color: ColorsString.primary,
                      size: Sizes.iconMd,
                    )
                  ],
                )
              ],
            ),
            onTap: () {},
          ),
        ),
        const LineContainer(),
        if (_ratingFigure != null &&
            _paginationRating != null &&
            _paginationRating!.listRatings!.isNotEmpty)
          ListView.builder(
            itemCount: _paginationRating!.listRatings!.length,
            shrinkWrap: true,
            padding: const EdgeInsets.symmetric(horizontal: 0, vertical: 0),
            physics: const NeverScrollableScrollPhysics(),
            itemBuilder: (_, index) => RatingDetail(
              rating: _paginationRating!.listRatings![index],
            ),
          ),
      ],
    );
  }
}
