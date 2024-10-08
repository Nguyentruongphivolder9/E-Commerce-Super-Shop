import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import '../../../common/screens/scanner_qr_screen.dart';

class CashInfo extends StatelessWidget {
  const CashInfo({super.key});

  @override
  Widget build(BuildContext context) {
    final verticalDivider = VerticalDivider(
      indent: 5,
      endIndent: 5,
      thickness: 1.5,
      width: 24,
      color: Colors.grey[300],
    );

    return Card(
      margin: const EdgeInsets.all(10.0),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(5),
      ),
      child: IntrinsicHeight(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: GestureDetector(
                  onTap: () {
                    //Điều hướng đến trang QRScannerScreen
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => QRScannerScreen()),
                    );
                  },
                  child: Image.asset(
                    'assets/Qr_Scanner.png',
                    height: 30,
                    color: Colors.black54,
                  ),
                ),
              ),
              verticalDivider,
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(left: 0.0),
                        child: Image.asset(
                          'assets/Shoppe_pay.png',
                          height: 30,
                          color: Colors.blue,
                        ),
                      ),
                      const SizedBox(width: 7),
                      const Text(
                        "Supper Pay",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 10,
                          color: Colors.black87,
                        ),
                      ),
                    ],
                  ),
                  const Text(
                    "Giảm 80.000Đ - Kích hoạt ví \n SupperPay ngay",
                    style: TextStyle(
                      fontWeight: FontWeight.normal,
                      fontSize: 8,
                      color: Colors.black87,
                    ),
                  ),
                ],
              ),
              verticalDivider,
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(left: 0.0),
                        child: Image.asset(
                          'assets/ShoppeCoin.png',
                          height: 28,
                        ),
                      ),
                      const SizedBox(width: 2),
                      const Text(
                        "Supper Coin",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 10,
                          color: Colors.black87,
                        ),
                      ),
                    ],
                  ),
                  const Text(
                    "Tích luỹ Supper Coin ngay",
                    style: TextStyle(
                      fontWeight: FontWeight.normal,
                      fontSize: 8,
                      color: Colors.black87,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
