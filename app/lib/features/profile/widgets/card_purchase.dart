// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'package:supershop_app/common/widgets/rounded_image.dart';
import 'package:supershop_app/enums/order_status.dart';
import 'package:supershop_app/features/profile/screens/rating_screen.dart';
import 'package:supershop_app/features/profile/widgets/order_btn.dart';
import 'package:supershop_app/models/order/order.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';
import 'package:supershop_app/utils/converts/number.dart';
import 'package:supershop_app/utils/converts/image.dart';
import 'package:supershop_app/utils/converts/string.dart';

class CardPurchase extends StatefulWidget {
  const CardPurchase({super.key, required this.order});
  final Order order;

  @override
  State<CardPurchase> createState() => _CardPurchaseState();
}

class _CardPurchaseState extends State<CardPurchase> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
            borderRadius: BorderRadius.all(
              Radius.circular(Sizes.borderRadiusMd),
            ),
            color: ColorsString.white),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
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
                      '${widget.order.shopInfomation['userName']}',
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
                Text(
                  capitalize(widget.order.orderStatus),
                  style: const TextStyle(
                    color: ColorsString.primary,
                    fontSize: Sizes.fontSizeSm,
                  ),
                )
              ],
            ),
            // center
            ListView.builder(
              itemCount: widget.order.orderItems.length,
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              itemBuilder: (context, index) {
                final order = widget.order;
                final orderItem = widget.order.orderItems[index];
                return Container(
                  margin: const EdgeInsets.only(top: 8),
                  height: 80,
                  child: Row(
                    children: [
                      Container(
                        height: 80,
                        width: 80,
                        margin: const EdgeInsets.only(right: 8),
                        decoration: BoxDecoration(
                          border: Border.all(width: 1, color: ColorsString.grey),
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: RoundedImage(
                          imageUrl: generateURLAvatar(order.shopInfomation['avatarUrl']),
                          borderRadius: BorderRadius.circular(5),
                          isNetworkImage: true,
                          height: double.infinity,
                          width: double.infinity,
                          fit: BoxFit.cover,
                        ),
                      ),
                      Expanded(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  orderItem.productName,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                      color: ColorsString.dark,
                                      fontSize: Sizes.fontSizeSm,
                                      fontWeight: FontWeight.w500),
                                ),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      orderItem.variantName.isNotEmpty
                                          ? orderItem.variantName
                                          : 'No variation',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        color: ColorsString.darkGrey,
                                        fontSize: Sizes.fontSizeXs,
                                      ),
                                    ),
                                    Text(
                                      orderItem.quantity.toString(),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        color: ColorsString.darkGrey,
                                        fontSize: Sizes.fontSizeXs,
                                      ),
                                    ),
                                  ],
                                )
                              ],
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                Text(
                                  '₫${formatCurrency(orderItem.price)}',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    color: ColorsString.dark,
                                    fontSize: Sizes.fontSizeSm,
                                  ),
                                ),
                              ],
                            )
                          ],
                        ),
                      )
                    ],
                  ),
                );
              },
            ),
            // bottom
            const SizedBox(
              height: 8,
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text("${widget.order.orderItems.length.toString()} item(s)"),
                    RichText(
                      overflow: TextOverflow.ellipsis,
                      text: TextSpan(
                        text: 'Total Order: ',
                        style: TextStyle(
                          fontSize: Sizes.fontSizeSm,
                          color: ColorsString.dark,
                        ),
                        children: <TextSpan>[
                          TextSpan(
                            text: '₫${formatCurrency(widget.order.orderTotal)}',
                            style: TextStyle(fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(
                  height: 12,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    OrderButton(
                      isRating: widget.order.isRating,
                      orderId: widget.order.id!,
                      status: getOrderStatus(widget.order.orderStatus),
                      handleClick: (action) {
                        if (action == 'rating') {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => RatingScreen(order: widget.order)),
                          );
                        }
                      },
                    ),
                  ],
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}
