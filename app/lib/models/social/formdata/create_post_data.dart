import 'dart:io';

import 'package:dio/dio.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path/path.dart' as path;

part '../../../generated/social/formdata/create_post_data.g.dart';

class CreatePostData {
  final String caption;
  final String creatorId;
  final String location;
  final String? tags;
  final List<File>? postImages;

  CreatePostData({
    required this.caption,
    required this.creatorId,
    required this.location,
    required this.tags,
    this.postImages,
  });

  factory CreatePostData.fromJson(Map<String, dynamic> json) =>
      _$CreatePostDataFromJson(json);

  Map<String, dynamic> toJson() => _$CreatePostDataToJson(this);

  Future<Map<String, dynamic>> toJsonWithMultipartFiles() async {
    final json = toJson();
    List<MultipartFile> multipartFiles = [];
    if (postImages != null) {
      for (var file in postImages!) {
        final compressedFile = await _compressImage(file);
        final mimeType = _getMimeType(compressedFile);
        multipartFiles.add(await MultipartFile.fromFile(
          compressedFile.path,
          filename: path.basename(compressedFile.path),
          contentType: DioMediaType.parse(mimeType),
        ));
      }
    }

    return {
      ...json,
      'postImages': multipartFiles,
    };
  }

  Future<File> _compressImage(File file) async {
    if (path.extension(file.path).toLowerCase() == '.png') {
      // Return the original file if it's a PNG
      return file;
    } else {
      // Compress the image if it's not a PNG
      final picker = ImagePicker();
      final compressedFile = await picker.pickImage(
        source: ImageSource.gallery,
        imageQuality: 85, // Adjust the quality as needed
      );
      return File(compressedFile!.path);
    }
  }

  String _getMimeType(File file) {
    final extension = path.extension(file.path).toLowerCase();
    switch (extension) {
      case '.png':
        return 'image/png';
      case '.jpg':
      case '.jpeg':
        return 'image/jpeg';
      default:
        return 'application/octet-stream';
    }
  }
}
