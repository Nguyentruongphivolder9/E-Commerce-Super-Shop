import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_widget_from_html/flutter_widget_from_html.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class ExpandableProductDescription extends StatefulWidget {
  final String description;
  const ExpandableProductDescription({super.key, required this.description});

  @override
  _ExpandableProductDescriptionState createState() =>
      _ExpandableProductDescriptionState();
}

class _ExpandableProductDescriptionState
    extends State<ExpandableProductDescription> {
  // bool _isExpanded = false;
  // bool _isContentOverflow = false;
  // final GlobalKey _contentKey = GlobalKey();

  // @override
  // void initState() {
  //   super.initState();
  //   WidgetsBinding.instance.addPostFrameCallback((_) {
  //     _checkContentOverflow();
  //   });
  // }

  // void _checkContentOverflow() {
  //   final RenderBox? renderBox =
  //       _contentKey.currentContext!.findRenderObject() as RenderBox?;
  //   if (renderBox != null && mounted) {
  //     setState(() {
  //       // Check if the content height is greater than 500px
  //       _isContentOverflow = renderBox.size.height > 500;
  //     });
  //   }
  // }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12),
      width: double.infinity,
      child: Flex(
        direction: Axis.vertical,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Product description',
            style: TextStyle(
              fontSize: Sizes.fontSizeSm,
              fontWeight: FontWeight.w700,
              color: ColorsString.black,
            ),
          ),
          const SizedBox(height: 8),
          // AnimatedContainer(
          //   duration: const Duration(milliseconds: 300),
          //   constraints: BoxConstraints(
          //     maxHeight: _isExpanded ? double.infinity : 500,
          //   ),
          // child: Wrap(
          Wrap(
            children: [
              HtmlWidget(
                widget.description,
                baseUrl: Uri.parse("https://www.hellohpc.com"),
              ),
            ],
          ),
          // ),
          const SizedBox(height: 3),
          // if (_isContentOverflow) // Only show toggle button if content overflows
          //   Center(
          //     child: GestureDetector(
          //       onTap: () {
          //         setState(() {
          //           _isExpanded = !_isExpanded;
          //         });
          //       },
          //       child: Row(
          //         mainAxisSize: MainAxisSize.min,
          //         children: [
          //           Text(
          //             _isExpanded ? 'Show less' : 'Show more',
          //             style: const TextStyle(
          //               color: ColorsString.dark,
          //               fontWeight: FontWeight.w500,
          //             ),
          //           ),
          //           Icon(
          //             _isExpanded
          //                 ? Icons.expand_less_outlined
          //                 : Icons.expand_more_outlined,
          //             size: Sizes.iconMd,
          //             color: ColorsString.dark,
          //           ),
          //         ],
          //       ),
          //     ),
          //   ),
        ],
      ),
    );
  }
}
