import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/common/widgets/line_container.dart';
import 'package:supershop_app/common/widgets/list_product.dart';
import 'package:supershop_app/features/product/components/sort_list_product.dart';
import 'package:supershop_app/models/params_config.dart';
import 'package:supershop_app/models/product/product.dart';
import 'package:supershop_app/providers/product.provider.dart';

class ShopProduct extends StatefulWidget {
  const ShopProduct({
    super.key,
    required this.listProducts,
    required this.params,
    required this.handleFilter,
  });
  final ParamsConfig params;
  final void Function(ParamsConfig) handleFilter;
  final List<Product> listProducts;

  @override
  State<ShopProduct> createState() => _ShopProductState();
}

class _ShopProductState extends State<ShopProduct> {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SortListProduct(
          params: widget.params,
          handleFilter: widget.handleFilter,
        ),
        const LineContainer(
          height: 8,
        ),
        Expanded(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: ListProduct(
                listProduct: widget.listProducts,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
