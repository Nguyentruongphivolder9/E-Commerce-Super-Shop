import 'package:flutter/material.dart';
import 'package:supershop_app/common/widgets/rounded_image.dart';
import 'package:supershop_app/features/product/screens/shop_detail.dart';
import 'package:supershop_app/models/account/seller_response.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';
import 'package:supershop_app/utils/converts/image.dart';
import 'package:supershop_app/utils/converts/number.dart';

class ShopInfo extends StatelessWidget {
  const ShopInfo({super.key, required this.sellerInfo});
  final SellerInfoResponse sellerInfo;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
      color: ColorsString.white,
      child: Column(
        children: [
          //
          InkWell(
            onTap: () {
              Navigator.of(context).push(MaterialPageRoute(
                  builder: (ctx) => ShopDetail(shopId: sellerInfo.account.id)));
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                //
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    RoundedImage(
                      imageUrl: generateURLAvatar(sellerInfo.account.avatarUrl),
                      borderRadius: BorderRadius.circular(70),
                      isNetworkImage: true,
                      padding: EdgeInsets.zero,
                      height: 60,
                      width: 60,
                      fit: BoxFit.cover,
                    ),
                    const SizedBox(
                      width: 10,
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          sellerInfo.account.userName,
                          style: const TextStyle(
                            fontSize: Sizes.fontSizeMd,
                            fontWeight: FontWeight.w500,
                            color: ColorsString.black,
                          ),
                        ),
                        const SizedBox(
                          height: 8,
                        ),
                        InkWell(
                          onTap: () {},
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 3),
                            decoration: BoxDecoration(
                              border: Border.all(
                                color: ColorsString.primary,
                                width: 1,
                              ),
                              borderRadius: const BorderRadius.all(
                                Radius.circular(3),
                              ),
                            ),
                            child: const Text(
                              'View Shop',
                              style: TextStyle(
                                color: ColorsString.primary,
                                fontSize: Sizes.fontSizeSm,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        )
                      ],
                    ),
                  ],
                ),

                //
                const Icon(
                  Icons.chevron_right_outlined,
                  color: ColorsString.primary,
                  size: Sizes.iconMd,
                )
              ],
            ),
          ),
          const SizedBox(
            height: 8,
          ),
          //
          Container(
            margin: const EdgeInsets.only(left: 70),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                InkWell(
                  onTap: () {},
                  child: RichText(
                    overflow: TextOverflow.ellipsis,
                    text: TextSpan(
                      text: formatNumberToSocialStyle(sellerInfo.productTotal),
                      style: const TextStyle(
                        fontSize: Sizes.fontSizeXs,
                        color: ColorsString.primary,
                      ),
                      children: const <TextSpan>[
                        TextSpan(
                          text: ' Products',
                          style: TextStyle(
                            color: ColorsString.black,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(
                  width: 12,
                ),
                InkWell(
                  onTap: () {},
                  child: RichText(
                    overflow: TextOverflow.ellipsis,
                    text: TextSpan(
                      text: formatNumberToSocialStyle(sellerInfo.ratingTotal),
                      style: const TextStyle(
                        fontSize: Sizes.fontSizeXs,
                        color: ColorsString.primary,
                      ),
                      children: const <TextSpan>[
                        TextSpan(
                          text: ' Ratings',
                          style: TextStyle(
                            color: ColorsString.black,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(
                  width: 12,
                ),
                RichText(
                  overflow: TextOverflow.ellipsis,
                  text: TextSpan(
                    text: formatNumberToSocialStyle(sellerInfo.followerTotal),
                    style: const TextStyle(
                      fontSize: Sizes.fontSizeXs,
                      color: ColorsString.primary,
                    ),
                    children: const <TextSpan>[
                      TextSpan(
                        text: ' Followers',
                        style: TextStyle(
                          color: ColorsString.black,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
