// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables
import 'package:easy_debounce/easy_debounce.dart';
import 'package:flutter/material.dart';
import 'package:input_quantity/input_quantity.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/features/cart/extendedModel/extended_cart_item.dart';
import 'package:supershop_app/providers/cart.provider.dart';
import 'package:supershop_app/utils/converts/utils_product.dart';

class QuantityController extends StatefulWidget {
  const QuantityController({
    super.key,
    required this.item,
    required this.indexShop,
    required this.indexCartItem,
  });

  final CartItemExtended item;
  final int indexShop;
  final int indexCartItem;

  @override
  State<QuantityController> createState() => _QuantityControllerState();
}

class _QuantityControllerState extends State<QuantityController> {
  final TextEditingController _controller = TextEditingController();

  void handleQuantity(int value) {
    if (value != null) {
      Provider.of<CartProvider>(context, listen: false)
          .handleChangeQuantity(widget.indexShop, widget.indexCartItem, value);
    }
  }

  int detectChangeFromApi() {
    var oldVal = int.tryParse(_controller.text) ?? 1;
    var newVal = widget.item.quantity;
    if (oldVal != newVal) {
      _controller.text = newVal.toString();
    }
    return oldVal;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300, width: 1),
        ),
        child: Consumer<CartProvider>(builder: (context, cartProvider, child) {
          return InputQty.int(
            maxVal: handleStockQuantityProduct(widget.item.product, widget.item.productVariantId),
            initVal: detectChangeFromApi(),
            minVal: 1,
            steps: 1,
            qtyFormProps: QtyFormProps(controller: _controller, keyboardType: TextInputType.number),
            decoration: QtyDecorationProps(
              qtyStyle: QtyStyle.classic,
              border: InputBorder.none,
              minusBtn: Container(
                padding: EdgeInsets.all(2),
                decoration: BoxDecoration(
                  border: Border(
                    right: BorderSide(
                      color: Colors.grey.shade300,
                      width: 1,
                    ),
                  ),
                ),
                child: Icon(
                  Icons.remove,
                  size: 16,
                  color: Colors.grey.shade700,
                ),
              ),
              plusBtn: Container(
                padding: EdgeInsets.all(2),
                decoration: BoxDecoration(
                  border: Border(
                    left: BorderSide(
                      color: Colors.grey.shade300,
                      width: 1,
                    ),
                  ),
                ),
                child: Icon(
                  Icons.add,
                  size: 16,
                  color: Colors.grey.shade700,
                ),
              ),
            ),
            onQtyChanged: (val) {
              EasyDebounce.debounce(
                'my-debouncer',
                Duration(milliseconds: 750),
                () => handleQuantity(val),
              );
            },
          );
        }));
  }
}
