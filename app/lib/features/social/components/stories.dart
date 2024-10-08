import 'package:flutter/material.dart';
import 'package:supershop_app/features/social/components/profile_avatar.dart';

import 'package:supershop_app/features/social/config/palette.dart';
import 'package:supershop_app/models/account/account.dart';
import 'package:supershop_app/models/social/post.dart';

class Stories extends StatelessWidget {
  final Account currentUser;
  final List<Post> posts;

  const Stories({
    super.key,
    required this.currentUser,
    required this.posts,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 200.0,
      color: Colors.white,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(
          vertical: 10.0,
          horizontal: 8.0,
        ),
        scrollDirection: Axis.horizontal,
        itemCount: 1 + posts.length,
        itemBuilder: (BuildContext context, int index) {
          if (index == 0) {
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4.0),
              child: _StoryCard(
                isAddStory: true,
                currentUser: currentUser,
                post: posts.first,
              ),
            );
          }
          final Post story = posts[index - 1];
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4.0),
            child: _StoryCard(
              post: story,
              currentUser: currentUser,
            ),
          );
        },
      ),
    );
  }
}

class _StoryCard extends StatelessWidget {
  final bool isAddStory;
  final Account currentUser;
  final Post? post;

  const _StoryCard({
    this.isAddStory = false,
    required this.currentUser,
    this.post,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // ClipRRect(
        //   borderRadius: BorderRadius.circular(12.0),
        //   child: CachedNetworkImage(
        //     imageUrl: isAddStory
        //         ? (currentUser.avatarUrl ?? '')
        //         : (post?.images ?? ''),
        //     height: double.infinity,
        //     width: 110.0,
        //     fit: BoxFit.cover,
        //   ),
        // ),
        Container(
          height: double.infinity,
          width: 110.0,
          decoration: BoxDecoration(
            gradient: Palette.storyGradient,
            borderRadius: BorderRadius.circular(12.0),
          ),
        ),
        Positioned(
          top: 8.0,
          left: 8.0,
          child: isAddStory
              ? Container(
                  height: 40.0,
                  width: 40.0,
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: IconButton(
                    padding: EdgeInsets.zero,
                    icon: const Icon(Icons.add),
                    iconSize: 30.0,
                    color: Palette.facebookBlue,
                    onPressed: () => print('Add to Story'),
                  ),
                )
              : ProfileAvatar(
                  key: Key(post!.creatorId), // Add the required key parameter
                  imageUrl: post!.creatorAvatarUrl,
                ),
        ),
        Positioned(
          bottom: 8.0,
          left: 8.0,
          right: 8.0,
          child: Text(
            isAddStory ? 'Add to Story' : post?.creatorName ?? '',
            style: const TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
