// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';
import 'package:supershop_app/models/params_config.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class TabsSortPurchases extends StatefulWidget {
  const TabsSortPurchases(
      {super.key,
      required this.status,
      required this.params,
      required this.handleOrderStatusChange});
  final ParamsConfig params;
  final String status;
  final void Function(ParamsConfig) handleOrderStatusChange;

  @override
  State<TabsSortPurchases> createState() => _TabsSortPurchasesState();
}

class _TabsSortPurchasesState extends State<TabsSortPurchases> {
  late ParamsConfig params;
  String? selectedSort;
  @override
  void initState() {
    // TODO: implement initState
    params = widget.params;
    selectedSort = widget.status;
    super.initState();
  }

  final List<Map<String, String>> sortOptions = [
    {"status": "pending", "label": "Pending"},
    {"status": "delivering", "label": "Delivering"},
    {"status": "completed", "label": "Completed"},
    {"status": "cancelled", "label": "Cancelled"},
    {"status": "refunded", "label": "Refunded"},
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 40,
      decoration: const BoxDecoration(
        color: ColorsString.white,
      ),
      child: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: List.generate(sortOptions.length, (index) {
                  final sortOption = sortOptions[index];
                  final isSelected = sortOption["status"] == selectedSort;

                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        selectedSort = sortOption['status'];
                      });
                      params = params.copyWith(status: selectedSort);
                      widget.handleOrderStatusChange(params);
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      height: double.infinity,
                      decoration: BoxDecoration(
                          color: ColorsString.white,
                          border: Border(
                            bottom: BorderSide(
                              color: isSelected ? ColorsString.primary : ColorsString.grey,
                              width: 1.5,
                            ),
                          )),
                      child: Center(
                        child: Text(
                          sortOption['label']!,
                          style: TextStyle(
                            color: isSelected ? ColorsString.primary : ColorsString.dark,
                            fontSize: Sizes.fontSizeMd,
                          ),
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
