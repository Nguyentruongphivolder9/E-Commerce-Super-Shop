import 'package:flutter/material.dart';
import 'package:supershop_app/enums/order_status.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class OrderButton extends StatelessWidget {
  final OrderStatus status;
  final Function(String) handleClick;
  final bool isRating;
  final String orderId;

  const OrderButton({
    super.key,
    required this.status,
    required this.handleClick,
    required this.isRating,
    required this.orderId,
  });

  @override
  Widget build(BuildContext context) {
    return _buildButton(context);
  }

  Widget _buildButton(BuildContext context) {
    switch (status) {
      case OrderStatus.pending:
        return ElevatedButton(
          onPressed: () => handleClick('cancel'),
          child: Text('Cancelled'),
        );
      case OrderStatus.confirmed:
        return ElevatedButton(
          onPressed: () => handleClick('cancel'),
          child: Text('Cancelled'),
        );
      case OrderStatus.delivering:
        return ElevatedButton(
          onPressed: () => handleClick('contactSeller'),
          child: Text('Contact Seller'),
          style: ElevatedButton.styleFrom(backgroundColor: Colors.lightBlue),
        );
      case OrderStatus.completed:
        return Row(
          children: [
            if (!isRating)
              InkWell(
                onTap: () => handleClick("rating"),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
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
              ),
            // TextButton(
            //   onPressed: () => Navigator.pushNamed(
            //     context,
            //     '/refund/${orderId}',
            //   ),
            //   child: Text('Request for Refund/Return'),
            //   style: TextButton.styleFrom(backgroundColor: Colors.red),
            // ),
          ],
        );
      case OrderStatus.cancelled:
      case OrderStatus.refunded:
        return ElevatedButton(
          onPressed: () => handleClick('contactSeller'),
          child: Text('Contact Seller'),
          style: ElevatedButton.styleFrom(backgroundColor: Colors.lightBlue),
        );
      case OrderStatus.all:
        return Container();
    }
  }
}
