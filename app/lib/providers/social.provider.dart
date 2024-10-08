// ignore_for_file: avoid_print

import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:supershop_app/models/social/formdata/create_post_data.dart';
import 'package:supershop_app/models/social/post.dart';
// import 'package:supershop_app/models/social/user.dart';
import 'package:supershop_app/models/success_response.dart';
import 'package:supershop_app/utils/network/http.dart';

class SocialProvider with ChangeNotifier {
  late final HttpDio _httpDio = HttpDio();

  List<Post> _listRecentPost = [];
  List<Post> get listPost => _listRecentPost;

  late Post _createdPost;
  Post get createdPost => _createdPost;

  // late User _userOfPosts;
  // User get userOfPosts => _userOfPosts;

  bool isLoading = false;
  String? errorMessage;

  SocialProvider() {
    Future.microtask(() => getRecentPosts());
  }

  // Future<void> getUserOfPosts(String userId) async {
  //   try {
  //     final response = await _httpDio.dio.get('chat/account/$userId');

  //     final successResponse = SuccessResponse<User>.fromJson(
  //         response.data, (json) => User.fromJson(json as Map<String, dynamic>));

  //     _userOfPosts = successResponse.body!;
  //     notifyListeners();
  //     print('User of posts: $_userOfPosts');
  //   } catch (e) {
  //     print("Error fetching user posts: $e");
  //     throw Exception('Failed to load posts: $e');
  //   }
  // }

  Future<void> getRecentPosts() async {
    try {
      final response = await _httpDio.dio.get('social/mobile/get_recent_posts');

      final successResponse = SuccessResponse<List<Post>>.fromJson(
          response.data,
          (json) => (json as List<dynamic>)
              .map((item) => Post.fromJson(item as Map<String, dynamic>))
              .toList());

      _listRecentPost = successResponse.body ?? [];
      notifyListeners();
      print('List post: $_listRecentPost');
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        errorMessage = 'Unauthorized: Please check your credentials.';
      } else {
        errorMessage = 'Failed to load posts: ${e.message}';
      }
      print("Error fetching recent posts: $e");
    } catch (e) {
      errorMessage = 'An unexpected error occurred: $e';
      print("Error fetching recent posts: $e");
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

//   final formData = FormData.fromMap({
//   'name': 'dio',
//   'date': DateTime.now().toIso8601String(),
//   'file': await MultipartFile.fromFile('./text.txt', filename: 'upload.txt'),
//   'files': [
//     await MultipartFile.fromFile('./text1.txt', filename: 'text1.txt'),
//     await MultipartFile.fromFile('./text2.txt', filename: 'text2.txt'),
//   ]
// });
// final response = await dio.post('/info', data: formData);

  Future<void> createPost({
    required String caption,
    required String creatorId,
    required String location,
    required String tags,
    List<File>? postImages,
  }) async {
    final createPostFormData = CreatePostData(
      caption: caption,
      creatorId: creatorId,
      location: location,
      tags: tags,
      postImages: postImages,
    );

    // Convert to JSON with MultipartFile objects
    final jsonWithMultipartFiles =
        await createPostFormData.toJsonWithMultipartFiles();

    // Create FormData from the JSON map
    final formData = FormData.fromMap(jsonWithMultipartFiles);

    // Send the FormData using dio
    final response = await _httpDio.dio.post('social/create_post',
        data: formData,
        options: Options(headers: {
          'Content-Type': 'multipart/form-data',
        }));

    print('Response: ${response.data}');
    print('Status code: ${response.statusCode}');

    if (response.statusCode == 201 && response.data != null) {
      print('Post created successfully');
      final successResponse = SuccessResponse<Post>.fromJson(
        response.data,
        (json) => Post.fromJson(json as Map<String, dynamic>),
      );

      _createdPost = successResponse.body!;
      notifyListeners();
      print('Created post: $_createdPost');
    } else {
      throw Exception('Failed to create post');
    }
  }

  Future<void> likePost(String postId) async {
    try {
      final response = await _httpDio.dio.post('social/like_post/$postId');

      if (response.statusCode == 200 && response.data != null) {
        print('Post liked successfully');
        final successResponse = SuccessResponse<Post>.fromJson(
          response.data,
          (json) => Post.fromJson(json as Map<String, dynamic>),
        );

        final likedPost = successResponse.body!;
        final index = _listRecentPost.indexWhere((post) => post.id == postId);
        _listRecentPost[index] = likedPost;
        notifyListeners();
        print('Liked post: $likedPost');
      } else {
        throw Exception('Failed to like post');
      }
    } catch (e) {
      print("Error liking post: $e");
      throw Exception('Failed to like post: $e');
    }
  }
}
