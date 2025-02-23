// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables
import 'dart:io';

import 'package:dotted_border/dotted_border.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:supershop_app/common/widgets/line_container.dart';
import 'package:supershop_app/common/widgets/rounded_image.dart';
import 'package:supershop_app/models/order/order_item_res.dart';
import 'package:supershop_app/models/rating/rating_request.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/config.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class ItemRating extends StatefulWidget {
  const ItemRating({
    super.key,
    required this.orderItem,
    required this.updateFormRequests,
  });
  final OrderItemRes orderItem;
  final void Function(RatingRequest) updateFormRequests;
  @override
  State<ItemRating> createState() => _ItemRatingState();
}

class _ItemRatingState extends State<ItemRating> {
  int ratingStar = 5;
  final ImagePicker _picker = ImagePicker();
  List<XFile>? _imageFiles = [];
  final TextEditingController accurateDescriptionController =
      TextEditingController();
  final TextEditingController productQualityController =
      TextEditingController();
  final TextEditingController additionalCommentsController =
      TextEditingController();

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      final RatingRequest request = RatingRequest(
        productId: widget.orderItem.id.toString(),
        orderItemId: widget.orderItem.id.toString(),
        ratingStar: ratingStar,
        comment: '',
        productQuality: '',
        trueDescription: '',
        imageFiles: [],
      );
      widget.updateFormRequests(request);
    });
  }

  @override
  void dispose() {
    accurateDescriptionController.dispose();
    productQualityController.dispose();
    additionalCommentsController.dispose();
    super.dispose();
  }

  Future<void> _pickMedia() async {
    final List<XFile>? response = await _picker.pickMultiImage(limit: 3);
    if (response != null) {
      List<XFile> validImages = [];

      for (var file in response) {
        String fileExtension = file.path.split('.').last.toLowerCase();
        int fileSize = await file.length();

        if ((fileExtension == 'png' ||
                fileExtension == 'jpg' ||
                fileExtension == 'jpeg') &&
            fileSize < 2 * 1024 * 1024) {
          validImages.add(file);
        }
      }

      if (validImages.isNotEmpty) {
        setState(() {
          if (_imageFiles!.length + validImages.length > 3) {
            int remainingSlots = 3 - _imageFiles!.length;
            _imageFiles!.addAll(validImages.take(remainingSlots));
          } else {
            _imageFiles!.addAll(validImages);
          }
        });
        _updateRatingRequest();
      } else {
        showDialog(
          context: context,
          barrierColor: Colors.transparent,
          builder: (BuildContext context) {
            return const AlertDialog(
              backgroundColor: ColorsString.bgOpacity,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.all(
                  Radius.circular(
                    Sizes.borderRadiusMd,
                  ),
                ),
              ),
              content: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    Icons.error,
                    color: ColorsString.white,
                    size: 50,
                  ),
                  SizedBox(height: 10),
                  Text(
                    'Please select valid image files (png, jpg, jpeg) under 2MB.',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: ColorsString.white,
                    ),
                  ),
                ],
              ),
            );
          },
        );

        Future.delayed(const Duration(seconds: 2), () {
          if (Navigator.canPop(context)) {
            Navigator.of(context).pop();
          }
        });
      }
    }
  }

  void _updateRatingRequest() {
    final String accurateDescription = accurateDescriptionController.text;
    final String productQuality = productQualityController.text;
    final String additionalComments = additionalCommentsController.text;

    final RatingRequest updatedRequest = RatingRequest(
      productId: widget.orderItem.productId.toString(),
      orderItemId: widget.orderItem.id.toString(),
      ratingStar: ratingStar,
      productQuality: productQuality,
      trueDescription: accurateDescription,
      comment: additionalComments,
      imageFiles: _imageFiles,
    );

    widget.updateFormRequests(updatedRequest);
  }

  void _onRatingChanged(int newRating) {
    setState(() {
      ratingStar = newRating;
    });
    _updateRatingRequest();
  }

  void _deleteImage(XFile xFile) {
    setState(() {
      _imageFiles?.removeWhere((file) => file.path == xFile.path);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
          decoration: BoxDecoration(),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  RoundedImage(
                    imageUrl:
                        "${Config.awsUrl}products/${widget.orderItem.imageUrl}",
                    borderRadius: BorderRadius.circular(5),
                    isNetworkImage: true,
                    height: 40,
                    width: 40,
                    fit: BoxFit.cover,
                  ),
                  SizedBox(
                    width: 12,
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.orderItem.productName,
                          style: TextStyle(
                            fontSize: Sizes.fontSizeSm,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          widget.orderItem.variantName,
                          style: TextStyle(
                              fontSize: Sizes.fontSizeXs,
                              color: ColorsString.darkGrey),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  )
                ],
              ),
              SizedBox(height: 12),
              Row(
                children: [
                  Text(
                    'Product Quality:',
                    style: TextStyle(fontSize: 16),
                  ),
                  const SizedBox(
                    width: 16,
                  ),
                  Flexible(
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: List.generate(5, (i) {
                        return Row(
                          children: [
                            InkWell(
                              onTap: () {
                                _onRatingChanged(i);
                              },
                              child: Icon(
                                Icons.star,
                                color: i < ratingStar
                                    ? ColorsString.star
                                    : Colors.grey[400],
                              ),
                            ),
                            if (i < 4) SizedBox(width: 4),
                          ],
                        );
                      }),
                    ),
                  ),
                ],
              ),
              SizedBox(height: 8),
              Wrap(
                spacing: 8.0,
                runSpacing: 8.0,
                children: [
                  for (var imageFile in _imageFiles!)
                    Stack(
                      children: [
                        SizedBox(
                          width: 77,
                          height: 77,
                          child: Image.file(
                            File(imageFile.path),
                            width: 77,
                            height: 77,
                            fit: BoxFit.cover,
                          ),
                        ),
                        Positioned(
                          top: 0,
                          right: 0,
                          child: InkWell(
                            onTap: () {
                              _deleteImage(imageFile);
                            },
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: BoxDecoration(
                                color: ColorsString.bgOpacity,
                              ),
                              child: Center(
                                child: Icon(
                                  Icons.close,
                                  size: Sizes.iconSm,
                                  color: ColorsString.white,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  if (_imageFiles!.length < 5)
                    Container(
                      width: 77,
                      height: 77,
                      decoration: BoxDecoration(
                        color: ColorsString.white,
                      ),
                      child: InkWell(
                        onTap: _pickMedia,
                        child: DottedBorder(
                          color: ColorsString.primary,
                          strokeWidth: 1,
                          dashPattern: [6, 3],
                          borderType: BorderType.RRect,
                          radius: const Radius.circular(3),
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.camera_alt,
                                  color: ColorsString.grey,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  _imageFiles!.isEmpty
                                      ? 'Add Photo'
                                      : '${_imageFiles!.length}/5',
                                  style: TextStyle(
                                    color: ColorsString.grey,
                                    fontSize: Sizes.fontSizeXs,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: accurateDescriptionController,
                decoration: InputDecoration(
                  labelText: "Accurate description",
                  labelStyle: TextStyle(fontSize: 14),
                  hintStyle: TextStyle(fontSize: 14),
                  border: OutlineInputBorder(),
                ),
                maxLines: 1,
                onChanged: (value) {
                  _updateRatingRequest();
                },
              ),
              SizedBox(height: 12),
              TextFormField(
                controller: productQualityController,
                decoration: InputDecoration(
                  labelText: "Product quality",
                  labelStyle: TextStyle(fontSize: 14),
                  hintStyle: TextStyle(fontSize: 14),
                  border: OutlineInputBorder(),
                ),
                maxLines: 1,
                onChanged: (value) {
                  _updateRatingRequest();
                },
              ),
              SizedBox(height: 12),
              TextFormField(
                controller: additionalCommentsController,
                decoration: InputDecoration(
                  labelStyle: TextStyle(fontSize: 14),
                  hintStyle:
                      TextStyle(fontSize: 14, color: Colors.grey.shade500),
                  hintText:
                      'Share more thoughts on the product to help other buyers',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
                onChanged: (value) {
                  _updateRatingRequest();
                },
              ),
            ],
          ),
        ),
        LineContainer(
          height: 8,
        ),
      ],
    );
  }
}
