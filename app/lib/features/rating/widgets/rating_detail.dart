import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:supershop_app/common/widgets/build_image_circular.dart';
import 'package:supershop_app/common/widgets/star_rating.dart';
import 'package:supershop_app/common/widgets/rounded_image.dart';
import 'package:supershop_app/models/rating/rating.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/config.dart';
import 'package:supershop_app/utils/constants/sizes.dart';
import 'package:supershop_app/utils/converts/date.dart';
import 'package:supershop_app/utils/converts/number.dart';

class RatingDetail extends StatelessWidget {
  const RatingDetail({super.key, required this.rating});
  final Rating rating;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {
        print("rating");
      },
      child: Container(
        decoration: const BoxDecoration(
          color: ColorsString.white,
        ),
        padding: const EdgeInsets.symmetric(
          horizontal: 10,
          vertical: 15,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Flexible(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      BuildImageCircular(
                        size: 30,
                        imageUrl: rating.account.avatarUrl,
                      ),
                      const SizedBox(
                        width: 8,
                      ),
                      Flexible(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              rating.account.userName,
                              style: const TextStyle(
                                  fontSize: Sizes.fontSizeSm,
                                  fontWeight: FontWeight.w600,
                                  color: ColorsString.black),
                              overflow: TextOverflow.ellipsis,
                            ),
                            StarRating(
                              rating: rating.ratingStar.toDouble(),
                              size: Sizes.fontSizeSm,
                              activeColor: ColorsString.star,
                              nonActiveColor: ColorsString.grey,
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                ),
                const SizedBox(
                  width: 16,
                ),
                InkWell(
                  onTap: () {
                    print("use full vote");
                  },
                  child: Row(
                    children: [
                      const Icon(
                        Icons.thumb_up_alt_outlined,
                        size: Sizes.iconSm,
                      ),
                      const SizedBox(
                        width: 3,
                      ),
                      Text(
                        'Use full (${formatNumberToSocialStyle(rating.countVote)})',
                        style: const TextStyle(
                          color: ColorsString.darkGrey,
                          fontSize: Sizes.fontSizeSm,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(
              height: 8,
            ),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(
                  width: 38,
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (rating.variantName != null)
                        Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          child: Text(
                            'Variation: ${rating.variantName}',
                            style: const TextStyle(
                              fontSize: Sizes.fontSizeXs,
                              color: ColorsString.darkGrey,
                            ),
                          ),
                        ),
                      if (rating.trueDescription != null &&
                          rating.trueDescription != '')
                        RichText(
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          text: TextSpan(
                            text: 'True to the description: ',
                            style: const TextStyle(
                              fontSize: Sizes.fontSizeSm,
                              color: ColorsString.darkGrey,
                            ),
                            children: <TextSpan>[
                              TextSpan(
                                text: rating.trueDescription!,
                                style: const TextStyle(
                                  color: ColorsString.black,
                                ),
                              ),
                            ],
                          ),
                        ),
                      if (rating.comment != null && rating.comment != '')
                        Container(
                          margin: const EdgeInsets.only(bottom: 5),
                          child: Text(
                            rating.comment!,
                            maxLines: 4,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: Sizes.fontSizeSm,
                              color: ColorsString.black,
                            ),
                          ),
                        ),
                      if (rating.feedbackImages != null &&
                          rating.feedbackImages!.isNotEmpty)
                        Row(
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: rating.feedbackImages!.map((item) {
                            return Padding(
                              padding: const EdgeInsets.only(right: 8.0),
                              child: InkWell(
                                onTap: () {},
                                child: SizedBox(
                                  height: 90,
                                  width: 90,
                                  child: Stack(
                                    children: [
                                      RoundedImage(
                                        height: double.infinity,
                                        width: double.infinity,
                                        fit: BoxFit.cover,
                                        imageUrl:
                                            "${Config.awsUrl}feedbacks/${item.imageUrl}",
                                        borderRadius: const BorderRadius.all(
                                          Radius.circular(0),
                                        ),
                                        isNetworkImage: true,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      const SizedBox(
                        height: 5,
                      ),
                      Text(
                        formatDateTime(rating.createdAt),
                        style: const TextStyle(
                          fontSize: Sizes.fontSizeXs,
                          color: ColorsString.darkGrey,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
