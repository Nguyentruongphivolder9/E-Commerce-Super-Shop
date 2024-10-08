// ignore_for_file: prefer_const_constructors, avoid_unnecessary_containers

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class OrderCallBack extends StatefulWidget {
  const OrderCallBack({super.key});

  @override
  State<OrderCallBack> createState() => _OrderCallBackState();
}

class _OrderCallBackState extends State<OrderCallBack> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        child: Text("Thanh toán thành công"),
      ),
    );
  }
}
