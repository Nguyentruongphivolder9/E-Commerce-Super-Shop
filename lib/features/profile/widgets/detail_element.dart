import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:supershop_app/common/widgets/line_container.dart';
import 'package:supershop_app/features/profile/screens/my_purchases_screen.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';
import '../../../models/profile/profilePage/second_floor_detail.dart';

class DetailElement extends StatelessWidget {
  final IconData icon;
  final String primaryText;
  final String? secondaryText;
  final VoidCallback? onTapIcon;
  final VoidCallback? onTapSecondaryText;
  final List<SecondFloorDetail> secondFloorDetail;

  const DetailElement({
    super.key,
    required this.icon,
    required this.primaryText,
    this.secondaryText,
    this.onTapIcon,
    this.onTapSecondaryText,
    required this.secondFloorDetail,
  });

  @override
  Widget build(BuildContext context) {
    return Wrap(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              GestureDetector(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (ctx) => const MyPurchasesScreens(),
                    ),
                  );
                },
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        primaryText,
                        style: const TextStyle(
                          fontSize: Sizes.fontSizeMd,
                          color: ColorsString.dark,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      if (secondaryText != null && secondaryText != '')
                        Row(
                          children: [
                            Text(
                              secondaryText!,
                              style: const TextStyle(
                                fontSize: Sizes.fontSizeXs,
                                color: ColorsString.dark,
                                fontWeight: FontWeight.w400,
                              ),
                            ),
                            const SizedBox(width: 3),
                            const Icon(
                              Icons.arrow_forward_ios_outlined,
                              size: Sizes.iconXs,
                              color: ColorsString.dark,
                            ),
                          ],
                        )
                    ],
                  ),
                ),
              ),
              const SizedBox(
                height: 16,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  for (var detail in secondFloorDetail)
                    InkWell(
                      onTap: detail.onTap,
                      child: SizedBox(
                        width: MediaQuery.of(context).size.width * 0.25,
                        child: Column(
                          children: [
                            Stack(
                              clipBehavior: Clip.none,
                              children: [
                                Icon(
                                  detail.icon,
                                  size: Sizes.iconLg,
                                  color: ColorsString.darkerGrey,
                                ),
                                if (detail.notifications != null)
                                  Positioned(
                                    right: -4,
                                    top: -4,
                                    child: Container(
                                      padding:
                                          const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                                      decoration: const BoxDecoration(
                                          color: ColorsString.secondary,
                                          borderRadius: BorderRadius.all(Radius.circular(16))),
                                      child: Center(
                                        child: Text(
                                          '${detail.notifications}',
                                          style: const TextStyle(
                                            fontSize: Sizes.fontSizeXXs,
                                            color: Colors.white,
                                            fontWeight: FontWeight.w400,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                            Text(
                              detail.name,
                              style: const TextStyle(
                                fontSize: Sizes.fontSizeXXs,
                                color: ColorsString.dark,
                                fontWeight: FontWeight.w400,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
        LineContainer(
          height: 8,
        )
      ],
    );
  }
}
