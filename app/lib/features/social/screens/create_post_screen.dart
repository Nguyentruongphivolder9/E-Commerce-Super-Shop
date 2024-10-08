import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/features/social/screens/social_screen.dart';
import 'package:supershop_app/providers/social.provider.dart';

class CreatePostScreen extends StatefulWidget {
  @override
  _CreatePostScreenState createState() => _CreatePostScreenState();
}

class _CreatePostScreenState extends State<CreatePostScreen> {
  final TextEditingController captionController = TextEditingController();
  final TextEditingController locationController = TextEditingController();
  final TextEditingController tagsController = TextEditingController();
  final List<File>? selectedImages = [];
  String? errorMessage;

  Future<void> addImages() async {
    final picker = ImagePicker();
    final List<XFile>? images = await picker.pickMultiImage(
      maxWidth: 800, // can be customized
      maxHeight: 600, // can be customized
    );

    if (images != null) {
      setState(() {
        for (XFile image in images) {
          selectedImages?.add(File(image.path));
        }
      });
    }
  }

  void createPost() async {
    try {
      final socialProvider =
          Provider.of<SocialProvider>(context, listen: false);

      await socialProvider.createPost(
        caption: captionController.text,
        creatorId:
            '21b4a0da-644b-488e-b510-4dae282d7d82', // Replace with actual creator ID
        location: locationController.text,
        tags: tagsController.text,
        postImages: selectedImages,
      );

      Get.snackbar('Success', 'Post Successfully Created');
      captionController.clear();
      locationController.clear();
      tagsController.clear();
      setState(() {
        selectedImages?.clear();
      });
      // Navigate back to the previous screen
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => const SocialScreen(),
        ),
      );

      // Refetch recent posts
      socialProvider.getRecentPosts();
    } catch (e) {
      Get.snackbar('Error', 'Something went wrong: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Post'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: captionController,
              decoration: const InputDecoration(
                labelText: 'Caption',
              ),
            ),
            const SizedBox(height: 10.0),
            TextField(
              controller: locationController,
              decoration: const InputDecoration(
                labelText: 'Location',
              ),
            ),
            const SizedBox(height: 10.0),
            TextField(
              controller: tagsController,
              decoration: const InputDecoration(
                labelText: 'Tags',
              ),
            ),
            const SizedBox(height: 10.0),
            ElevatedButton(
              onPressed: addImages,
              child: const Text('Add Images'),
            ),
            const SizedBox(height: 10.0),
            ElevatedButton(
              onPressed: createPost,
              child: const Text('Create Post'),
            ),
            const SizedBox(height: 10.0),
            if (errorMessage != null)
              Text(
                errorMessage!,
                style: const TextStyle(color: Colors.red),
              ),
            Expanded(
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  crossAxisSpacing: 4.0,
                  mainAxisSpacing: 4.0,
                ),
                itemCount: selectedImages?.length,
                itemBuilder: (context, index) {
                  return Image.file(selectedImages![index]);
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
