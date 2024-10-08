import 'package:flutter/material.dart';

class NoOrders extends StatelessWidget {
  const NoOrders({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: BoxConstraints(minHeight: 350),
      decoration: BoxDecoration(
        color: Colors.white,
      ),
      width: double.infinity,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Image.asset(
            "assets/no-orders.png",
            height: 90,
            width: 90,
          ),
          Text(
            'No orders yet',
            style: TextStyle(fontSize: 20),
          ),
          // OutlinedButton(
          //   style: ButtonStyle(
          //     shape: WidgetStateProperty.all(RoundedRectangleBorder(
          //       borderRadius: BorderRadius.zero,
          //     )),
          //     side: WidgetStateProperty.all(BorderSide(color: Colors.blue)),
          //     padding: WidgetStateProperty.all(
          //         EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0)),
          //   ),
          //   onPressed: () {
          //     // Get.to(() => HomeScreen());
          //   },
          //   child: Text(
          //     'Go shopping now',
          //     style: TextStyle(color: Colors.blue), // Màu chữ
          //   ),
          // )
        ],
      ),
    );
  }
}
