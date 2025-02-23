// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables
import 'package:app_links/app_links.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/common/widgets/button.dart';
import 'package:supershop_app/features/cart/utils/utils_cart.dart';
import 'package:supershop_app/features/cart/widgets/scale_alert_dialog.dart';
import 'package:supershop_app/features/checkout/screens/order_callback.dart';
import 'package:supershop_app/features/checkout/services/stripe_service.dart';
import 'package:supershop_app/features/profile/screens/my_purchases_screen.dart';
import 'package:supershop_app/providers/cart.provider.dart';
import 'package:supershop_app/providers/order.provider.dart';
import 'package:supershop_app/utils/constants/config.dart';
import 'package:supershop_app/utils/converts/number.dart';

class Checkout extends StatefulWidget {
  const Checkout({super.key});

  @override
  State<Checkout> createState() => _CheckoutState();
}

class _CheckoutState extends State<Checkout> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController(text: "Albert Einstein");
  final _phoneController = TextEditingController(text: "0999999999");
  final _addressController =
      TextEditingController(text: "3654 Sanford Streets, South Giselebury, MN 27282-0505");
  String? _selectedPaymentMethod;
  final List<String> paymentMethods = ['stripe'];
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    final appLinks = AppLinks();

    final sub = appLinks.uriLinkStream.listen((uri) {
      String? paymentIntentId = uri.queryParameters['paymentIntentId'];
      String? stripeResponseCode = uri.queryParameters['stripeResponseCode'];

      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => OrderCallBack()),
        );
      });
    });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      handleChangeAddress(_nameController.text, _phoneController.text, _addressController.text);
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _addressController.dispose();
    super.dispose();
  }

  void _saveAddress() {
    if (_formKey.currentState!.validate()) {
      setState(() {});
      handleChangeAddress(_nameController.text, _phoneController.text, _addressController.text);
    }
  }

  String? _validateName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Full Name is required';
    }
    if (value.length < 2) {
      return 'Full Name is too short';
    }
    return null;
  }

  String? _validatePhone(String? value) {
    if (value == null || value.isEmpty) {
      return 'Phone Number is required';
    }
    if (!RegExp(r'^[0-9]{10}$').hasMatch(value)) {
      return 'Phone number: 10 digits';
    }
    return null;
  }

  String? _validateAddress(String? value) {
    if (value == null || value.isEmpty) {
      return 'Address is required';
    }
    return null;
  }

  void _showInputDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text("Enter Delivery Address"),
          content: Container(
            child: SingleChildScrollView(
              scrollDirection: Axis.vertical,
              physics: AlwaysScrollableScrollPhysics(),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.location_on,
                          color: Colors.blue,
                          size: 25,
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          "Delivery Address",
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _nameController,
                      textInputAction: TextInputAction.next,
                      textAlignVertical: TextAlignVertical.center,
                      cursorColor: Colors.black,
                      cursorWidth: 1,
                      style: TextStyle(fontSize: 14),
                      decoration: InputDecoration(
                        contentPadding: const EdgeInsets.all(10),
                        isDense: true,
                        labelText: "Name",
                        labelStyle: TextStyle(fontSize: 14),
                        hintStyle: TextStyle(fontSize: 12),
                        errorStyle: TextStyle(fontSize: 10),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(5),
                          borderSide: const BorderSide(
                            width: 0.5,
                            color: Colors.grey,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: const BorderSide(
                            width: 0.5,
                            color: Color.fromARGB(255, 109, 109, 109),
                          ),
                        ),
                      ),
                      validator: _validateName,
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _phoneController,
                      textInputAction: TextInputAction.next,
                      textAlignVertical: TextAlignVertical.center,
                      cursorColor: Colors.black,
                      cursorWidth: 1,
                      keyboardType: TextInputType.number,
                      style: TextStyle(fontSize: 14),
                      inputFormatters: [
                        FilteringTextInputFormatter.digitsOnly,
                        LengthLimitingTextInputFormatter(10), // Limit to 10 digits
                      ],
                      decoration: InputDecoration(
                        contentPadding: const EdgeInsets.all(10),
                        isDense: true,
                        labelText: "Phone",
                        labelStyle: TextStyle(fontSize: 14),
                        hintStyle: TextStyle(fontSize: 12),
                        errorStyle: TextStyle(fontSize: 10),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(5),
                          borderSide: const BorderSide(
                            width: 0.5,
                            color: Colors.grey,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: const BorderSide(
                            width: 0.5,
                            color: Color.fromARGB(255, 109, 109, 109),
                          ),
                        ),
                      ),
                      validator: _validatePhone,
                    ),
                    const SizedBox(height: 20),
                    TextFormField(
                      controller: _addressController,
                      textInputAction: TextInputAction.next,
                      textAlignVertical: TextAlignVertical.center,
                      cursorColor: Colors.black,
                      cursorWidth: 1,
                      style: TextStyle(fontSize: 14),
                      decoration: InputDecoration(
                        contentPadding: const EdgeInsets.all(10),
                        isDense: true,
                        labelText: "Address",
                        labelStyle: TextStyle(fontSize: 14),
                        hintStyle: TextStyle(fontSize: 10),
                        errorStyle: TextStyle(fontSize: 10),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(5),
                          borderSide: const BorderSide(
                            width: 0.5,
                            color: Colors.grey,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderSide: const BorderSide(
                            width: 0.5,
                            color: Color.fromARGB(255, 109, 109, 109),
                          ),
                        ),
                      ),
                      validator: _validateAddress,
                    ),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Đóng dialog
              },
              child: const Text("Cancel"),
            ),
            TextButton(
              onPressed: () {
                if (_formKey.currentState!.validate()) {
                  _saveAddress(); // Thực hiện lưu địa chỉ
                  Navigator.of(context).pop(); // Đóng dialog
                }
              },
              child: const Text("Save"),
            ),
          ],
        );
      },
    );
  }

  void handleCommentChange(String shopId, String value) {
    if (shopId.isNotEmpty) {
      Provider.of<OrderProvider>(context, listen: false).handleCommentChange(shopId, value);
    }
  }

  void handleChangeAddress(String name, String phoneNumber, String adress) {
    Provider.of<OrderProvider>(context, listen: false).handlChangeAdress(name, phoneNumber, adress);
  }

  void _selectPaymentMethod(String method) {
    setState(() {
      _selectedPaymentMethod = method;
    });
    print(method);
    Provider.of<OrderProvider>(context, listen: false).handleChangePaymentThod(method);
  }

  Future<void> handleSubmitOrders() async {
    if (Provider.of<OrderProvider>(context, listen: false).listOrderForCheckout.isEmpty) {
      showDialog(
        context: context,
        barrierColor: Colors.white.withOpacity(0),
        builder: (BuildContext context) {
          return ScaleAlertDialog(
            message: 'No orders to checkout',
            isScale: false,
          );
        },
      );
      return;
    }
    if (_selectedPaymentMethod != "stripe") {
      showDialog(
        context: context,
        barrierColor: Colors.white.withOpacity(0),
        builder: (BuildContext context) {
          return ScaleAlertDialog(
            message: 'Please select payment method',
            isScale: false,
          );
        },
      );
    } else {
      var total = Provider.of<OrderProvider>(context, listen: false)
          .listOrderForCheckout
          .fold(0.0, (previousValue, order) => previousValue + order.orderTotal);

      try {
        await StripeService.instance.makePayment(total.round());
      } catch (e) {
        showDialog(
          context: context,
          barrierColor: Colors.white.withOpacity(0),
          builder: (BuildContext context) {
            return ScaleAlertDialog(
              message: 'The payment flow has been canceled',
              isScale: false,
            );
          },
        );
        rethrow;
      }

      try {
        final res = await Provider.of<OrderProvider>(context, listen: false)
            .placeOrder(StripeService.paymentIntentId);
        StripeService.paymentIntentId = '';
        Provider.of<CartProvider>(context, listen: false).fetchCart();
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => MyPurchasesScreens()),
        );
        showDialog(
          context: context,
          barrierColor: Colors.white.withOpacity(0),
          builder: (BuildContext context) {
            return ScaleAlertDialog(
              message: 'You have paid successfully',
              isScale: false,
            );
          },
        );

        Future.delayed(const Duration(seconds: 2), () {
          if (Navigator.canPop(context)) {
            Navigator.of(context).pop();
          }
        });
      } catch (e) {}
    }
  }

  @override
  Widget build(BuildContext context) {
    printObject(Provider.of<OrderProvider>(context).listOrderForCheckout);
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        shadowColor: Colors.grey,
        surfaceTintColor: Colors.transparent,
        title: const Text("Checkout"),
        leading: BackButton(
          color: Colors.blue,
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: Container(
        decoration: BoxDecoration(color: Colors.grey.shade200),
        child: SingleChildScrollView(
          scrollDirection: Axis.vertical,
          physics: AlwaysScrollableScrollPhysics(),
          child: Column(
            children: [
              Container(
                margin: EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(color: Colors.white),
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.location_on,
                          color: Colors.blue,
                          size: 25,
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          "Delivery Address",
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: EdgeInsets.only(left: 25),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              Text(_nameController.text),
                              Container(
                                margin: EdgeInsets.symmetric(horizontal: 6),
                                width: 1,
                                height: 10,
                                color: Colors.black,
                              ),
                              Text(_phoneController.text),
                            ],
                          ),
                          Text(_addressController.text)
                        ],
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: EdgeInsets.only(left: 25),
                      height: 30,
                      child: OutlinedButton(
                        style: ButtonStyle(
                          shape: WidgetStateProperty.all(RoundedRectangleBorder(
                            borderRadius: BorderRadius.all(Radius.circular(0)),
                          )),
                          side: WidgetStateProperty.all(BorderSide(color: Colors.blue)),
                          padding: WidgetStateProperty.all(
                              EdgeInsets.symmetric(horizontal: 10.0, vertical: 0)),
                        ),
                        onPressed: () {
                          _showInputDialog(context);
                        },
                        child: Text(
                          'Change address',
                          style: TextStyle(color: Colors.blue), // Màu chữ
                        ),
                      ),
                    )
                  ],
                ),
              ),
              Container(
                decoration: BoxDecoration(
                  color: Colors.grey.shade200,
                ),
                child: Consumer<OrderProvider>(
                  builder: (context, orderProvider, child) {
                    final listOrderForCheckout = orderProvider.listOrderForCheckout;
                    return ListView.builder(
                        physics: NeverScrollableScrollPhysics(),
                        itemCount: listOrderForCheckout.length,
                        shrinkWrap: true,
                        itemBuilder: (context, indexShop) {
                          final shopGroup = listOrderForCheckout[indexShop];
                          return Container(
                            padding: EdgeInsets.only(top: 10),
                            margin: EdgeInsets.only(bottom: 8),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(2),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: EdgeInsets.symmetric(horizontal: 8),
                                  child: Text(
                                    '${shopGroup.shopName ?? ''}',
                                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                                  ),
                                ),
                                Container(
                                  padding: EdgeInsets.symmetric(horizontal: 8),
                                  child: ListView.builder(
                                    physics: NeverScrollableScrollPhysics(),
                                    shrinkWrap: true,
                                    itemCount: shopGroup.orderItems.length,
                                    itemBuilder: (context, indexItem) {
                                      final item = shopGroup.orderItems[indexItem];
                                      return Container(
                                        height: 110,
                                        margin: EdgeInsets.only(bottom: 5),
                                        child: Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            ClipRRect(
                                              borderRadius: BorderRadius.circular(5),
                                              child: Image.network(
                                                "${Config.awsUrl}products/${item.imageUrl}",
                                                fit: BoxFit.cover,
                                                height: 90,
                                                width: 90,
                                              ),
                                            ),
                                            Expanded(
                                              child: Container(
                                                padding: EdgeInsets.symmetric(horizontal: 5),
                                                child: Column(
                                                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                                  crossAxisAlignment: CrossAxisAlignment.start,
                                                  children: [
                                                    Text(
                                                      "${item.productName}",
                                                      style: TextStyle(
                                                          color: Colors.grey.shade700,
                                                          fontSize: 16),
                                                      overflow: TextOverflow.ellipsis,
                                                      maxLines: 1,
                                                    ),
                                                    Text(item.variantName,
                                                        style: TextStyle(fontSize: 15)),
                                                    Row(
                                                      mainAxisAlignment:
                                                          MainAxisAlignment.spaceBetween,
                                                      children: [
                                                        Text(
                                                          "₫${formatCurrency(item.price)}",
                                                          style: TextStyle(
                                                              color: Color(0xFFEE4D2D),
                                                              fontSize: 15),
                                                        ),
                                                        Text("x ${item.quantity}")
                                                      ],
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      );
                                    },
                                  ),
                                ),
                                Container(
                                  width: double.infinity,
                                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    border: Border(top: BorderSide(color: Colors.grey, width: 1)),
                                  ),
                                  child: Flex(
                                    direction: Axis.horizontal,
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    children: [
                                      Text("Message: "),
                                      Expanded(
                                          child: TextField(
                                        decoration: InputDecoration(
                                          contentPadding: const EdgeInsets.all(10),
                                          labelStyle: TextStyle(fontSize: 14),
                                          hintStyle: TextStyle(fontSize: 12),
                                          errorStyle: TextStyle(fontSize: 10),
                                          border: InputBorder.none,
                                          hintText: "Leave Message",
                                          focusedBorder: InputBorder.none,
                                        ),
                                        onChanged: (value) {
                                          handleCommentChange(shopGroup.shopId, value);
                                        },
                                      ))
                                    ],
                                  ),
                                ),
                                Container(
                                  width: double.infinity,
                                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 14),
                                  decoration: BoxDecoration(
                                    border: Border(top: BorderSide(color: Colors.grey, width: 1)),
                                  ),
                                  child: Flex(
                                    direction: Axis.horizontal,
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    crossAxisAlignment: CrossAxisAlignment.center,
                                    children: [
                                      Text(
                                          "Order Total (${shopGroup.orderItems.length} ${shopGroup.orderItems.length > 1 ? 'item' : 'items'})"),
                                      Text(
                                        "₫${formatCurrency(shopGroup.orderTotal)}",
                                        style: TextStyle(
                                          fontSize: 17,
                                          color: Color(0xFFEE4D2D),
                                        ),
                                      )
                                    ],
                                  ),
                                )
                              ],
                            ),
                          );
                        });
                  },
                ),
              ),
              Container(
                padding: const EdgeInsets.all(5),
                margin: EdgeInsets.only(bottom: 8),
                decoration: BoxDecoration(color: Colors.white),
                child: Flex(
                  direction: Axis.horizontal,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.payment,
                          size: 20,
                          color: Colors.blue,
                        ),
                        SizedBox(
                          width: 8,
                        ),
                        Text(
                          "Payment Option",
                          style: TextStyle(fontSize: 16),
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8),
                      child: Row(
                        children: paymentMethods.map((method) {
                          return GestureDetector(
                            onTap: () => _selectPaymentMethod(method),
                            child: Container(
                              padding: EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                              margin: EdgeInsets.only(right: 8),
                              decoration: BoxDecoration(
                                color:
                                    _selectedPaymentMethod == method ? Colors.blue : Colors.white,
                                border: Border.all(
                                  color:
                                      _selectedPaymentMethod == method ? Colors.blue : Colors.grey,
                                  width: 1,
                                ),
                                borderRadius: BorderRadius.all(Radius.circular(2)),
                              ),
                              child: Text(
                                method,
                                style: TextStyle(
                                  fontSize: 14,
                                  color: _selectedPaymentMethod == method
                                      ? Colors.white
                                      : Colors.grey.shade700,
                                ),
                              ),

                              // child: Stack(
                              //   children: [
                              //     Text(
                              //       method,
                              //       style: TextStyle(fontSize: 14, fontStyle: FontStyle.normal),
                              //     ),
                              //     if (_selectedPaymentMethod == method)
                              //       Positioned(
                              //         top: -6,
                              //         right: -8,
                              //         child: Icon(
                              //           Icons.check,
                              //           color: Colors.green,
                              //           size: 15,
                              //         ),
                              //       ),
                              //   ],
                              // ),
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 15),
                decoration: BoxDecoration(color: Colors.white),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Icon(
                          Icons.note,
                          size: 20,
                          color: Colors.blue,
                        ),
                        SizedBox(
                          width: 8,
                        ),
                        Text(
                          "Payment Details",
                          style: TextStyle(fontSize: 16),
                        ),
                      ],
                    ),
                    SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Merchandise Subtotal",
                          style: TextStyle(color: Colors.grey.shade500),
                        ),
                        Text(
                          "₫${formatCurrency(context.read<OrderProvider>().listOrderForCheckout.fold(0.0, (previousValue, order) => previousValue + order.orderTotal))}",
                          style: TextStyle(color: Colors.grey.shade500),
                        ),
                      ],
                    ),
                    SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          "Total Payment",
                          style: TextStyle(fontSize: 18),
                        ),
                        Text(
                          "₫${formatCurrency(context.read<OrderProvider>().listOrderForCheckout.fold(0.0, (previousValue, order) => previousValue + order.orderTotal))}",
                          style: TextStyle(
                            fontSize: 18,
                            color: Color(0xFFEE4D2D),
                          ),
                        ),
                      ],
                    )
                  ],
                ),
              )
            ],
          ),
        ),
      ),
      bottomNavigationBar: Container(
        height: 50,
        width: double.infinity,
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              spreadRadius: 0.6,
              blurRadius: 0.9,
              offset: Offset(0, -3),
            )
          ],
          color: Colors.white,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Total payment',
                      style: TextStyle(fontSize: 15, color: Colors.grey.shade600),
                      overflow: TextOverflow.visible,
                      softWrap: true,
                    ),
                    Text(
                      "₫${formatCurrency(context.read<OrderProvider>().listOrderForCheckout.fold(0.0, (previousValue, order) => previousValue + order.orderTotal))}",
                      style: TextStyle(
                        fontSize: 20,
                        color: Color(0xFFEE4D2D),
                        fontWeight: FontWeight.bold,
                      ),
                    )
                  ],
                ),
                SizedBox(width: 10),
                Button(
                  onTap: () async {
                    await handleSubmitOrders();
                  },
                  color: Colors.blue,
                  height: double.infinity,
                  width: 120,
                  child: Text(
                    "Place order",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
