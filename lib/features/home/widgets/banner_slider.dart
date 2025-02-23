import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:supershop_app/common/widgets/circular_container.dart';
import 'package:supershop_app/controllers/promo_slider_controller.dart';
import 'package:supershop_app/common/widgets/rounded_image.dart';
import 'package:supershop_app/models/advertise/banner_response.dart';
import 'package:supershop_app/utils/constants/config.dart';

class BannerSlider extends StatefulWidget {
  const BannerSlider({super.key, required this.listBanners});
  final List<BannerResponse> listBanners;

  @override
  State<BannerSlider> createState() => _BannerSliderState();
}

class _BannerSliderState extends State<BannerSlider> {
  @override
  Widget build(BuildContext context) {
    final controller = Get.put(PromoSliderController());
    final listBanners = widget.listBanners;
    return Stack(
      children: [
        CarouselSlider(
          options: CarouselOptions(
            height: double.infinity,
            viewportFraction: 1,
            initialPage: 0,
            enableInfiniteScroll: true,
            reverse: false,
            autoPlay: true,
            autoPlayInterval: const Duration(seconds: 3),
            autoPlayAnimationDuration: const Duration(milliseconds: 500),
            scrollDirection: Axis.horizontal,
            onPageChanged: (index, _) =>
                controller.updateItemIndicatorBanner(index),
          ),
          items: listBanners.isNotEmpty
              ? listBanners.expand<Widget>((banner) {
                  if (banner.advertiseImages != null &&
                      banner.advertiseImages!.isNotEmpty) {
                    return banner.advertiseImages!
                        .where((image) => image.imageUrl.isNotEmpty)
                        .map<Widget>((image) {
                      return RoundedImage(
                        imageUrl:
                            '${Config.awsUrl}advertises/${image.imageUrl}',
                        borderRadius: BorderRadius.circular(0),
                        isNetworkImage: true,
                        height: double.infinity,
                        width: double.infinity,
                        applyImageRadius: false,
                        padding: EdgeInsets.zero,
                        fit: BoxFit.cover,
                      );
                    }).toList();
                  }
                  return <Widget>[];
                }).toList()
              : [
                  RoundedImage(
                    imageUrl:
                        'https://hanhphucshop.com/wp-content/uploads/2022/04/tiki-12-12.jpg',
                    borderRadius: BorderRadius.circular(0),
                    isNetworkImage: true,
                    height: double.infinity,
                    width: double.infinity,
                    applyImageRadius: false,
                    padding: EdgeInsets.zero,
                    fit: BoxFit.cover,
                  ),
                  RoundedImage(
                    imageUrl:
                        'https://simg.zalopay.com.vn/zlp-website/assets/loai_ma_giam_gia_tiki_1_1_8c21ac261a.jpg',
                    borderRadius: BorderRadius.circular(0),
                    isNetworkImage: true,
                    height: double.infinity,
                    width: double.infinity,
                    applyImageRadius: false,
                    padding: EdgeInsets.zero,
                    fit: BoxFit.cover,
                  ),
                ],
        ),
        Positioned(
          bottom: 20,
          left: 0,
          child: Container(
            color: Colors.transparent,
            width: MediaQuery.of(context).size.width, // Full screen width
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                listBanners.fold(
                    0,
                    (sum, innerArray) =>
                        sum + innerArray.advertiseImages!.length),
                (i) => CCircularContainer(
                  width: 6,
                  height: 6,
                  margin: const EdgeInsets.only(right: 5),
                  backgroundColor: controller.bannerCurrentIndex.value == i
                      ? Colors.blue
                      : Colors.grey,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
