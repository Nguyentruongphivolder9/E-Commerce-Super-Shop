import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:supershop_app/features/product/components/button_filter.dart';
import 'package:supershop_app/models/params_config.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class FromToPriceFilter extends StatefulWidget {
  const FromToPriceFilter(
      {super.key, required this.params, required this.inputFromToPrice});
  final ParamsConfig params;
  final void Function(String?, String?) inputFromToPrice;

  @override
  _FromToPriceFilterState createState() => _FromToPriceFilterState();
}

class _FromToPriceFilterState extends State<FromToPriceFilter> {
  TextEditingController minPriceController = TextEditingController();
  TextEditingController maxPriceController = TextEditingController();
  int minPrice = 0;
  int maxPrice = 120000000;

  @override
  void initState() {
    minPriceController =
        TextEditingController(text: widget.params.price_min ?? '');
    maxPriceController =
        TextEditingController(text: widget.params.price_max ?? '');
    // TODO: implement initState
    super.initState();
  }

  @override
  void dispose() {
    minPriceController.dispose();
    maxPriceController.dispose();
    super.dispose();
  }

  void _validatePrices() {
    String minPriceText = minPriceController.text
        .replaceAll(RegExp(r'\D'), '')
        .replaceFirst(RegExp(r'^0+'), '');
    String maxPriceText = maxPriceController.text
        .replaceAll(RegExp(r'\D'), '')
        .replaceFirst(RegExp(r'^0+'), '');

    minPriceController.text = minPriceText;
    maxPriceController.text = maxPriceText;

    int? minPriceValue = int.tryParse(minPriceText);
    int? maxPriceValue = int.tryParse(maxPriceText);

    if (minPriceValue != null && maxPriceValue == null) {
      widget.inputFromToPrice(minPriceValue.toString(), null);
    } else if (minPriceValue == null && maxPriceValue != null) {
      widget.inputFromToPrice(null, maxPriceValue.toString());
    } else {
      widget.inputFromToPrice(
          minPriceValue.toString(), maxPriceValue.toString());
    }
  }

  bool _optionPriceSelected(String minPriceValue, String maxPriceValue) {
    if (minPriceValue == minPriceController.text &&
        maxPriceValue == maxPriceController.text) {
      return true;
    }
    return false;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          color: ColorsString.lightGrey,
          padding: const EdgeInsets.all(8),
          child: Row(
            children: [
              // Min price input
              Expanded(
                child: Container(
                  width: double.infinity,
                  height: 40,
                  decoration: BoxDecoration(
                    color: ColorsString.white,
                    border: Border.all(
                      color: ColorsString.grey,
                      width: 1,
                    ),
                    borderRadius: const BorderRadius.all(
                      Radius.circular(3),
                    ),
                  ),
                  child: TextFormField(
                    cursorHeight: 16,
                    cursorColor: ColorsString.primary,
                    controller: minPriceController,
                    keyboardType: TextInputType.number,
                    textAlign: TextAlign.center,
                    decoration: InputDecoration(
                      hintText: 'Min'.toUpperCase(),
                      hintStyle: const TextStyle(
                        color: ColorsString.grey,
                        fontSize: Sizes.fontSizeMd,
                        fontWeight: FontWeight.w500,
                      ),
                      border: InputBorder.none,
                    ),
                    onChanged: (value) {
                      _validatePrices();
                    },
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(9),
                    ],
                    onFieldSubmitted: (value) {
                      FocusScope.of(context).unfocus();
                    },
                  ),
                ),
              ),

              Container(
                height: 2,
                width: 16,
                margin: const EdgeInsets.symmetric(horizontal: 4),
                color: ColorsString.grey,
              ),
              // Max price input
              Expanded(
                child: Container(
                  width: double.infinity,
                  height: 40,
                  decoration: BoxDecoration(
                    color: ColorsString.white,
                    border: Border.all(
                      color: ColorsString.grey,
                      width: 1,
                    ),
                    borderRadius: const BorderRadius.all(
                      Radius.circular(3),
                    ),
                  ),
                  child: TextFormField(
                    cursorHeight: 16,
                    cursorColor: ColorsString.primary,
                    controller: maxPriceController,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      hintText: 'Max'.toUpperCase(),
                      hintStyle: const TextStyle(
                        color: ColorsString.grey,
                        fontSize: Sizes.fontSizeMd,
                        fontWeight: FontWeight.w500,
                      ),
                      border: InputBorder.none,
                    ),
                    textAlign: TextAlign.center,
                    onChanged: (value) {
                      _validatePrices();
                    },
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(9),
                    ],
                    onFieldSubmitted: (value) {
                      FocusScope.of(context).unfocus();
                    },
                  ),
                ),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 8,
        ),
        Row(
          children: [
            Expanded(
              child: SizedBox(
                height: 40,
                child: ButtonFilter(
                  text: '0-100k',
                  selected: _optionPriceSelected('0', '100000'),
                  onTap: () {
                    setState(() {
                      minPriceController.text = '0';
                      maxPriceController.text = '100000';
                      widget.inputFromToPrice('0', '100000');
                    });
                  },
                ),
              ),
            ),
            const SizedBox(
              width: 8,
            ),
            Expanded(
              child: SizedBox(
                height: 40,
                child: ButtonFilter(
                    text: '100k-200k',
                    selected: _optionPriceSelected('100000', '200000'),
                    onTap: () {
                      setState(() {
                        minPriceController.text = '100000';
                        maxPriceController.text = '200000';
                        widget.inputFromToPrice('100000', '200000');
                      });
                    }),
              ),
            ),
            const SizedBox(
              width: 8,
            ),
            Expanded(
              child: SizedBox(
                height: 40,
                child: ButtonFilter(
                    text: '200k-300k',
                    selected: _optionPriceSelected('200000', '300000'),
                    onTap: () {
                      setState(() {
                        minPriceController.text = '200000';
                        maxPriceController.text = '300000';
                        widget.inputFromToPrice('200000', '300000');
                      });
                    }),
              ),
            ),
          ],
        )
      ],
    );
  }
}
