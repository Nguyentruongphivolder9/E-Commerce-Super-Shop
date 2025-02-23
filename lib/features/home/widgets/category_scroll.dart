import 'package:flutter/material.dart';
import 'package:supershop_app/common/widgets/rounded_image.dart';
import 'package:supershop_app/features/product/screens/product_filter.dart';
import 'package:supershop_app/models/category/category.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/config.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class CategoryScroll extends StatelessWidget {
  const CategoryScroll({super.key, required this.categories});
  final List<Category> categories;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Category',
            style: TextStyle(
              fontSize: Sizes.fontSizeMd,
              color: ColorsString.dark,
              fontWeight: FontWeight.w400,
            ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 120,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: categories.map((category) {
                return InkWell(
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (ctx) => ProductFilter(
                          parentId: category.parentId != null
                              ? '${category.parentId}.${category.id}'
                              : category.id,
                        ),
                      ),
                    );
                  },
                  child: Container(
                    height: 100,
                    width: 80,
                    margin: const EdgeInsets.only(right: 6),
                    child: Column(
                      children: [
                        RoundedImage(
                          imageUrl:
                              '${Config.awsUrl}categories/${category.categoryImages![0].imageUrl}',
                          borderRadius: BorderRadius.circular(5),
                          isNetworkImage: true,
                          height: 70,
                          width: 80,
                          fit: BoxFit.cover,
                        ),
                        const SizedBox(height: 8),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          child: Text(
                            category.name,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: Sizes.fontSizeXs,
                              color: ColorsString.dark,
                              fontWeight: FontWeight.w400,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}
