import 'package:flutter/material.dart';
import 'package:supershop_app/common/widgets/line_container.dart';
import 'package:supershop_app/common/widgets/rounded_image.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class CardToRate extends StatelessWidget {
  const CardToRate({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: const BoxDecoration(
            borderRadius: BorderRadius.all(
              Radius.circular(Sizes.borderRadiusMd),
            ),
            color: ColorsString.white),
        child: Column(
          children: [
            const Row(
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Icon(
                  Icons.wallet_giftcard_outlined,
                  size: Sizes.fontSizeSm,
                  color: ColorsString.darkGrey,
                ),
                SizedBox(
                  width: 4,
                ),
                Text(
                  'HAHANCO Official Store',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: ColorsString.dark,
                    fontSize: Sizes.fontSizeSm,
                    fontWeight: FontWeight.w600,
                  ),
                )
              ],
            ),
            // center
            Container(
              margin: const EdgeInsets.symmetric(vertical: 8),
              height: 70,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    height: 70,
                    width: 70,
                    margin: const EdgeInsets.only(right: 8),
                    decoration: BoxDecoration(
                      border: Border.all(width: 1, color: ColorsString.grey),
                      borderRadius: BorderRadius.circular(5),
                    ),
                    child: RoundedImage(
                      imageUrl:
                          'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lxtnsty2sb8b44@resize_w450_nl.webp',
                      borderRadius: BorderRadius.circular(5),
                      isNetworkImage: true,
                      height: double.infinity,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                  const Expanded(
                    child: Text(
                      'Bikini 2 mảnh hoa Hồng nổi phối ren (sẵn hàng - ship hoả tốc- che tên)',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                          color: ColorsString.dark,
                          fontSize: Sizes.fontSizeSm,
                          fontWeight: FontWeight.w500),
                    ),
                  )
                ],
              ),
            ),
            // bottom
            const LineContainer(),

            Padding(
              padding: const EdgeInsets.only(top: 12, bottom: 4),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    '21 days left to review',
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: ColorsString.dark,
                      fontSize: Sizes.fontSizeXs,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  InkWell(
                    onTap: () {},
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: ColorsString.primary,
                          width: 1,
                        ),
                        borderRadius: const BorderRadius.all(
                          Radius.circular(Sizes.borderRadiusSm),
                        ),
                      ),
                      child: const Text(
                        'Rate',
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
            ),
          ],
        ),
      ),
    );
  }
}
