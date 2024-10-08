// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/features/profile/widgets/item_rating.dart';
import 'package:supershop_app/models/order/order.dart';
import 'package:supershop_app/models/rating/rating_request.dart';
import 'package:supershop_app/providers/order.provider.dart';
import 'package:supershop_app/providers/rating.provider.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class RatingScreen extends StatefulWidget {
  const RatingScreen({super.key, required this.order});
  final Order order;
  @override
  State<RatingScreen> createState() => _RatingScreenState();
}

class _RatingScreenState extends State<RatingScreen> {
  List<RatingRequest> ratingsRequest = [];

  void updateFormRequests(RatingRequest newForm) {
    setState(() {
      ratingsRequest = ratingsRequest
          .where((rating) => rating.orderItemId != newForm.orderItemId)
          .toList();
      ratingsRequest.add(newForm);
    });
  }

  void handleSendRequests() async {
    final ratingProvider = Provider.of<RatingProvider>(context, listen: false);
    print(ratingsRequest.map((item) => item.toJson()));
    for (var ratingRequest in ratingsRequest) {
      try {
        await ratingProvider.createRating(ratingRequest);
      } catch (e) {
        print("Error sending rating for request: ${ratingRequest.orderItemId}");
      }
    }
    print("All rating requests have been sent.");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        shadowColor: ColorsString.grey,
        backgroundColor: ColorsString.white,
        surfaceTintColor: ColorsString.white,
        elevation: 0.2,
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
          'Rating',
          style: TextStyle(
            fontSize: Sizes.fontSizeXl,
            color: ColorsString.dark,
            fontWeight: FontWeight.w400,
          ),
        ),
        actions: [
          Padding(
            padding: EdgeInsets.only(right: 15),
            child: GestureDetector(
              onTap: () {
                handleSendRequests();
              },
              child: Text(
                'Send',
                style: TextStyle(fontSize: 15, color: Colors.blue),
              ),
            ),
          )
        ],
      ),
      body: Container(
        decoration: BoxDecoration(color: ColorsString.white),
        child: SingleChildScrollView(
          child: Consumer<OrderProvider>(
            builder: (context, orderProvider, child) {
              return ListView.builder(
                physics: NeverScrollableScrollPhysics(),
                shrinkWrap: true,
                itemCount: widget.order.orderItems.length,
                itemBuilder: (context, index) {
                  final orderItem = widget.order.orderItems[index];
                  return ItemRating(
                    orderItem: orderItem,
                    updateFormRequests: updateFormRequests,
                  );
                },
              );
            },
          ),
        ),
      ),
    );
  }
}
