// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supershop_app/common/navbar/navbar.dart';
import 'package:supershop_app/common/widgets/button.dart';
import 'package:supershop_app/common/widgets/list_product.dart';
import 'package:supershop_app/controllers/navbar_controller.dart';
import 'package:supershop_app/features/cart/extendedModel/extended_cart_item.dart';
import 'package:supershop_app/features/cart/extendedModel/extended_cart_item_byshop.dart';
import 'package:supershop_app/features/cart/utils/utils_cart.dart';
import 'package:supershop_app/features/cart/widgets/scale_alert_dialog.dart';
import 'package:supershop_app/features/cart/widgets/quantity_controller.dart';
import 'package:supershop_app/features/cart/widgets/variant_bottom_sheet.dart';
import 'package:supershop_app/features/checkout/models/order_req.dart';
import 'package:supershop_app/features/checkout/screens/checkout.dart';
import 'package:supershop_app/models/order/order_item.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:supershop_app/models/product/product_variant.dart';
import 'package:supershop_app/providers/cart.provider.dart';
import 'package:supershop_app/providers/order.provider.dart';
import 'package:supershop_app/providers/product.provider.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/config.dart';
import 'package:supershop_app/utils/constants/sizes.dart';
import 'package:supershop_app/utils/converts/utils_product.dart';
import 'package:supershop_app/utils/converts/number.dart';
import 'package:flutter_slidable/flutter_slidable.dart';

class CartScreen extends StatefulWidget {
  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> with TickerProviderStateMixin {
  bool isOpened = false;
  bool isDeleteAllOpen = false;
  late SlidableController _slidableController;

  @override
  void initState() {
    super.initState();
    _fetchCart();
    _slidableController = SlidableController(this);
  }

  Future<void> _fetchCart() async {
    final provider = Provider.of<CartProvider>(context, listen: false);
    await provider.fetchCart();
  }

  Future<void> _refresh() async {
    await _fetchCart();
  }

  bool isAllOnShopChecked(int indexShop) {
    var listCartItemByShop =
        Provider.of<CartProvider>(context, listen: false).listCartItemByShop;
    if (listCartItemByShop.isEmpty) {
      return false;
    }
    return listCartItemByShop[indexShop].items.every((item) => item.checked);
  }

  bool isAllChecked() {
    var listCartItemByShop =
        Provider.of<CartProvider>(context, listen: false).listCartItemByShop;
    if (listCartItemByShop.isEmpty) {
      return false;
    }
    return listCartItemByShop
        .every((grShop) => grShop.items.every((item) => item.checked));
  }

  void handleCheck(int shopIndex, int cartItemIndex, bool? value) {
    if (value != null) {
      Provider.of<CartProvider>(context, listen: false)
          .toggleItemChecked(shopIndex, cartItemIndex, value);
    }
  }

  void handleCheckAllOnShop(int shopIndex, bool? value) {
    if (value != null) {
      Provider.of<CartProvider>(context, listen: false)
          .toggleItemOnShop(shopIndex, value);
    }
  }

  void handleCheckAll(bool? value) {
    if (value != null) {
      Provider.of<CartProvider>(context, listen: false).toggleAll(value);
    }
  }

  void handleDeleteItem(int indexShop, String id) {
    if (id != null) {
      Provider.of<CartProvider>(context, listen: false)
          .handleDeleteItem(indexShop, id);
    }
  }

  void handleDeleteAll() {
    Provider.of<CartProvider>(context, listen: false).handleDeleteAll();
  }

  void _variantBottomSheet(
      String id, Product product, ProductVariant? productVariant) {
    if (product.isVariant) {
      showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(Sizes.borderRadiusLg),
          ),
        ),
        builder: (ctx) => VariantBotSheet(
          id: id,
          product: product,
          productVariant: productVariant,
        ),
      );
    }
  }

  List<OrderItem> getOrderItemsWithVariantName(List<CartItemExtended> items) {
    return items
        .map((item) => OrderItem(
              cartItemId: item.id,
              productId: item.product.id,
              productVariantId: item.productVariantId,
              imageUrl: handleImageProduct(item.product, item.productVariantId),
              productName: item.product.name,
              variantName: hanldeVariantNameByProVariant(
                  item.productVariantId, item.product),
              quantity: item.quantity,
              price: handlePriceProduct(item.product, item.productVariantId),
            ))
        .toList();
  }

  void handleSetOrdersToProvider() {
    List<CartItemExtendedByShop> listCheckedItemByShopp =
        Provider.of<CartProvider>(context, listen: false).listCheckedItemByShop;
    List<OrderReq> ordersReq = listCheckedItemByShopp
        .where((shop) => shop.items.isNotEmpty)
        .map((shop) {
      final orderItems = getOrderItemsWithVariantName(shop.items);

      return OrderReq(
        recipientName: 'Albert Einstein',
        recipientPhone: "0999999999",
        recipientAddress: '112 Mercer Street, Princeton, New Jersey',
        orderTotal: calculateTotalOrderOnshop(
            listCheckedItemByShopp, shop.shopInfo['id']),
        orderStatus: 'pending',
        paymentMethod: 'cod',
        shopId: shop.shopInfo['id'],
        shopName: shop.shopInfo['userName'],
        comment: '',
        orderItems: orderItems,
      );
    }).toList();

    Provider.of<OrderProvider>(context, listen: false)
        .handleTakeOrdersFromCheckout(ordersReq);
  }

  @override
  Widget build(BuildContext context) {
    printObject(context.watch<CartProvider>().listCheckedItemByShop);
    final listProductRecommendation =
        Provider.of<ProductProvider>(context, listen: true)
            .listProductRecommendation;
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        shadowColor: Colors.grey,
        surfaceTintColor: Colors.transparent,
        title: const Text("Cart"),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: GestureDetector(
              onTap: () {
                setState(() {
                  isDeleteAllOpen = !isDeleteAllOpen;
                });
              },
              child: Text(
                "Edit",
                style: TextStyle(fontSize: 15),
              ),
            ),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _refresh,
        child: Container(
          decoration: BoxDecoration(color: Colors.grey.shade200),
          child: SingleChildScrollView(
            scrollDirection: Axis.vertical,
            physics: AlwaysScrollableScrollPhysics(),
            child: Column(
              children: [
                Container(
                  padding: EdgeInsets.all(7),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade200,
                  ),
                  child: Consumer<CartProvider>(
                    builder: (context, cartProvider, child) {
                      final listCartItemsByShop =
                          cartProvider.listCartItemByShop;
                      if (listCartItemsByShop.isEmpty) {
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
                                "assets/no-products.png",
                                height: 90,
                                width: 90,
                              ),
                              Text(
                                'Oops ,Your shopping cart is empty.',
                                style: TextStyle(fontSize: 20),
                              ),
                              OutlinedButton(
                                style: ButtonStyle(
                                  shape: WidgetStateProperty.all(
                                      RoundedRectangleBorder(
                                    borderRadius: BorderRadius.zero,
                                  )),
                                  side: WidgetStateProperty.all(
                                      BorderSide(color: Colors.blue)),
                                  padding: WidgetStateProperty.all(
                                      EdgeInsets.symmetric(
                                          horizontal: 16.0, vertical: 8.0)),
                                ),
                                onPressed: () {
                                  final navbarController =
                                      Get.put(NavbarController());
                                  navbarController.changeTabIndex(0);
                                },
                                child: Text(
                                  'Go shopping now',
                                  style:
                                      TextStyle(color: Colors.blue), // Màu chữ
                                ),
                              )
                            ],
                          ),
                        );
                      }

                      return ListView.builder(
                          physics: NeverScrollableScrollPhysics(),
                          itemCount: listCartItemsByShop.length,
                          shrinkWrap: true,
                          itemBuilder: (context, indexShop) {
                            final shopGroup = listCartItemsByShop[indexShop];
                            return Container(
                              margin: EdgeInsets.only(bottom: 7),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(2),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Flex(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceAround,
                                    direction: Axis.horizontal,
                                    children: [
                                      Checkbox(
                                        splashRadius: 20,
                                        activeColor: Colors.blue,
                                        value: isAllOnShopChecked(indexShop),
                                        onChanged: (value) {
                                          handleCheckAllOnShop(
                                              indexShop, value);
                                        },
                                      ),
                                      Text(
                                        '${shopGroup.shopInfo['userName'] ?? ''}',
                                        style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 18),
                                      ),
                                      Spacer(flex: 1),
                                    ],
                                  ),
                                  ListView.builder(
                                    physics: NeverScrollableScrollPhysics(),
                                    shrinkWrap: true,
                                    itemCount: shopGroup.items.length,
                                    itemBuilder: (context, indexItem) {
                                      final item = shopGroup.items[indexItem];
                                      return Slidable(
                                        // controller: _slidableController,
                                        groupTag: shopGroup.shopInfo['id'],
                                        endActionPane: ActionPane(
                                          extentRatio: 0.3,
                                          motion: StretchMotion(),
                                          children: [
                                            SlidableAction(
                                              flex: 1,
                                              onPressed: (context) {
                                                handleDeleteItem(
                                                    indexShop, item.id);
                                              },
                                              backgroundColor: Colors.red,
                                              foregroundColor: Colors.white,
                                              icon: Icons.delete,
                                              label: 'Delete',
                                            ),
                                          ],
                                        ),
                                        child: Container(
                                          height: 110,
                                          margin: EdgeInsets.only(bottom: 5),
                                          child: Row(
                                            mainAxisAlignment:
                                                MainAxisAlignment.spaceBetween,
                                            children: [
                                              Checkbox(
                                                splashRadius: 20,
                                                activeColor: Colors.blue,
                                                value: item.checked,
                                                onChanged: (value) {
                                                  handleCheck(indexShop,
                                                      indexItem, value);
                                                },
                                              ),
                                              ClipRRect(
                                                borderRadius:
                                                    BorderRadius.circular(5),
                                                child: Image.network(
                                                  "${Config.awsUrl}products/${handleImageProduct(item.product, item.productVariantId)}",
                                                  fit: BoxFit.cover,
                                                  height: 90,
                                                  width: 90,
                                                  errorBuilder: (BuildContext
                                                          context,
                                                      Object error,
                                                      StackTrace? stackTrace) {
                                                    return Image.network(
                                                      'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lzsom0z2w2ht85@resize_w80_nl.webp', // Đường dẫn đến ảnh phụ
                                                      fit: BoxFit.cover,
                                                      height: 90,
                                                      width: 90,
                                                    );
                                                  },
                                                ),
                                              ),
                                              Expanded(
                                                child: Container(
                                                  padding: EdgeInsets.symmetric(
                                                      horizontal: 5),
                                                  child: Column(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .spaceEvenly,
                                                    crossAxisAlignment:
                                                        CrossAxisAlignment
                                                            .start,
                                                    children: [
                                                      Text(
                                                        "${item.product.name}",
                                                        style: TextStyle(
                                                            color: Colors
                                                                .grey.shade700,
                                                            fontSize: 16),
                                                        overflow: TextOverflow
                                                            .ellipsis,
                                                        maxLines: 1,
                                                      ),
                                                      Container(
                                                        color: Colors
                                                            .grey.shade200,
                                                        padding:
                                                            EdgeInsets.only(
                                                                left: 5,
                                                                top: 2,
                                                                bottom: 2),
                                                        child: GestureDetector(
                                                          onTap: () {
                                                            var productValFind = item
                                                                .product
                                                                .productVariants
                                                                ?.firstWhereOrNull(
                                                                    (proVal) {
                                                              return proVal
                                                                      .id ==
                                                                  item.productVariantId;
                                                            });

                                                            _variantBottomSheet(
                                                                item.id,
                                                                item.product,
                                                                productValFind);
                                                          },
                                                          child: Row(
                                                            mainAxisSize:
                                                                MainAxisSize
                                                                    .min,
                                                            children: [
                                                              Text(
                                                                  hanldeVariantNameByProVariant(
                                                                      item
                                                                          .productVariantId,
                                                                      item
                                                                          .product),
                                                                  style: TextStyle(
                                                                      fontSize:
                                                                          15)),
                                                              SizedBox(
                                                                  width: 8),
                                                              Icon(
                                                                  Icons
                                                                      .keyboard_arrow_down_sharp,
                                                                  size: 20,
                                                                  color: Colors
                                                                      .blue),
                                                            ],
                                                          ),
                                                        ),
                                                      ),
                                                      Row(
                                                        mainAxisAlignment:
                                                            MainAxisAlignment
                                                                .spaceBetween,
                                                        children: [
                                                          Text(
                                                            "₫${formatCurrency(handlePriceProduct(item.product, item.productVariantId))}",
                                                            style: TextStyle(
                                                                color: Color(
                                                                    0xFFEE4D2D),
                                                                fontSize: 15),
                                                          ),
                                                          QuantityController(
                                                            item: item,
                                                            indexShop:
                                                                indexShop,
                                                            indexCartItem:
                                                                indexItem,
                                                          ),
                                                        ],
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      );
                                    },
                                  ),
                                ],
                              ),
                            );
                          });
                    },
                  ),
                ),
                Container(
                  decoration: const BoxDecoration(color: ColorsString.white),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  child: Column(
                    children: [
                      Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: Row(
                          children: [
                            Expanded(
                              child: Container(
                                height: 1,
                                color: ColorsString.black,
                              ),
                            ),
                            const SizedBox(width: 8),
                            const Text(
                              'You May Also Like',
                              style: TextStyle(
                                color: ColorsString.black,
                                fontSize: Sizes.fontSizeSm,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Container(
                                height: 1,
                                color: ColorsString.black,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (listProductRecommendation.isNotEmpty)
                        ListProduct(
                          listProduct: listProductRecommendation,
                        )
                    ],
                  ),
                )
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: Container(
        height: 50,
        width: double.infinity,
        decoration: BoxDecoration(
          border:
              Border(bottom: BorderSide(width: 1, color: Colors.grey.shade200)),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.1),
              spreadRadius: 0.5,
              blurRadius: 1,
              offset: Offset(0, -3),
            )
          ],
          color: Colors.white,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Checkbox(
                  splashRadius: 20,
                  activeColor: Colors.blue,
                  value: isAllChecked(),
                  onChanged: (value) {
                    handleCheckAll(value);
                  },
                ),
                Text("All",
                    style:
                        TextStyle(fontSize: 14, color: Colors.grey.shade500)),
              ],
            ),
            isDeleteAllOpen
                ? Container(
                    width: 100,
                    height: 35,
                    padding: EdgeInsets.only(right: 16),
                    child: OutlinedButton(
                      style: ButtonStyle(
                        shape: WidgetStateProperty.all(RoundedRectangleBorder(
                          borderRadius: BorderRadius.all(Radius.circular(8)),
                        )),
                        side: WidgetStateProperty.all(
                            BorderSide(color: Colors.blue)),
                        padding: WidgetStateProperty.all(EdgeInsets.symmetric(
                            horizontal: 14.0, vertical: 1)),
                      ),
                      onPressed: () {
                        if (context
                            .read<CartProvider>()
                            .listCheckedItemByShop
                            .isEmpty) {
                          showDialog(
                            context: context,
                            barrierColor: Colors.white.withOpacity(0),
                            builder: (BuildContext context) {
                              return ScaleAlertDialog(
                                message: "Please select products",
                                isScale: true,
                              );
                            },
                          );
                        } else {
                          showDialog(
                            context: context,
                            builder: (BuildContext context) {
                              return ScaleAlertDialog(
                                message:
                                    'Do you want to remove ${context.watch<CartProvider>().listCheckedItemByShop.fold(0, (result, current) => result + current.items.length)} item(s)?',
                                textColor: Colors.black,
                                backgroundColor: Colors.white,
                                noIcon: true,
                                isScale: false,
                                onConfirm: () {
                                  handleDeleteAll(); // Hàm xử lý khi xác nhận
                                },
                              );
                            },
                          );
                        }
                      },
                      child: Text(
                        'Delete',
                        style: TextStyle(color: Colors.blue), // Màu chữ
                      ),
                    ),
                  )
                : Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Total: ₫${formatCurrency(calculateTotalOrder(Provider.of<CartProvider>(context, listen: true).listCheckedItemByShop))}',
                        style: TextStyle(
                            fontSize: 14, fontWeight: FontWeight.bold),
                        overflow: TextOverflow.visible,
                        softWrap: true,
                      ),
                      SizedBox(width: 10),
                      Button(
                        onTap: () {
                          if (context
                              .read<CartProvider>()
                              .listCheckedItemByShop
                              .isEmpty) {
                            showDialog(
                              context: context,
                              barrierColor: Colors.white.withOpacity(0),
                              builder: (BuildContext context) {
                                return ScaleAlertDialog(
                                  message:
                                      "You have not selected any items for checkout",
                                  isScale: true,
                                );
                              },
                            );
                          } else {
                            handleSetOrdersToProvider();
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (ctx) => Checkout(),
                              ),
                            );
                          }
                        },
                        color: Colors.blue,
                        height: double.infinity,
                        width: 100,
                        child: Text(
                          "Checkout",
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
