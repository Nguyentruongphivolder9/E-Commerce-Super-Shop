import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/account/seller_response.dart';
import 'package:supershop_app/models/category/category_of_shop.dart';
import 'package:supershop_app/models/category/category_of_shop_decoration.dart';
import 'package:supershop_app/models/product/product.dart';

part '../../generated/product/shop_detail_response.g.dart';

@JsonSerializable()
class ShopDetailResponse {
  SellerInfoResponse shopInfo;
  List<Product>? topSales;
  List<CategoryOfShop>? categoryOfShop;
  List<CategoryOfShopDecoration>? categoryOfShopDecoration;
  ShopDetailResponse({
    required this.shopInfo,
    this.topSales,
    this.categoryOfShop,
    this.categoryOfShopDecoration,
  });

  factory ShopDetailResponse.fromJson(Map<String, dynamic> json) =>
      _$ShopDetailFromJson(json);
}
