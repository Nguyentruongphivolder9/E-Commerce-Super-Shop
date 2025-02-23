import 'package:cached_network_image/cached_network_image.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter/material.dart';

import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:supershop_app/features/social/components/components.dart';
import 'package:supershop_app/models/social/post.dart';
import 'package:supershop_app/utils/constants/config.dart';

class PostContainer extends StatelessWidget {
  final Post post;

  const PostContainer({
    super.key,
    required this.post,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(
        vertical: 5.0,
        horizontal: 0.0,
      ),
      elevation: 0.0,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8.0),
        color: Colors.white,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _PostHeader(key: Key('post_${post.id}'), post: post),
                  const SizedBox(height: 4.0),
                  Text(post.caption),
                  const SizedBox(height: 6.0),
                  if (post.tags != "" && post.tags != null)
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          '#${post.tags}',
                          style: const TextStyle(
                            fontSize: 12.0,
                            color: Colors.blue,
                          ),
                        ),
                        const SizedBox(height: 3.0),
                      ],
                    ),
                ],
              ),
            ),
            if (post.postImageResponses.isNotEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8.0),
                child: CarouselSlider(
                  options: CarouselOptions(
                    height: 400.0,
                    enlargeCenterPage: true,
                    autoPlay: true,
                    aspectRatio: 16 / 9,
                    autoPlayCurve: Curves.fastOutSlowIn,
                    enableInfiniteScroll: true,
                    autoPlayAnimationDuration:
                        const Duration(milliseconds: 800),
                    viewportFraction: 0.8,
                  ),
                  items: post.postImageResponses.map((image) {
                    return Builder(
                      builder: (BuildContext context) {
                        return Container(
                          width: MediaQuery.of(context).size.width,
                          margin: const EdgeInsets.symmetric(horizontal: 5.0),
                          decoration: const BoxDecoration(
                            color: Colors.blueAccent,
                          ),
                          child: CachedNetworkImage(
                            imageUrl: '${Config.awsUrl}posts/${image.imageUrl}',
                            fit: BoxFit.cover,
                            placeholder: (context, url) => const Center(
                              child: CircularProgressIndicator(),
                            ),
                            errorWidget: (context, url, error) => const Center(
                              child: Icon(Icons.error),
                            ),
                          ),
                        );
                      },
                    );
                  }).toList(),
                ),
              ),
            // Padding(
            //   padding: const EdgeInsets.symmetric(horizontal: 12.0),
            //   child: _PostStats(key: Key('postStats_${post.id}'), post: post),
            // ),
          ],
        ),
      ),
    );
  }
}

class _PostHeader extends StatelessWidget {
  final Post post;

  const _PostHeader({
    required Key key,
    required this.post,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        ProfileAvatar(
            key: Key('profileAvatar_${post.creatorId}'),
            imageUrl: post.creatorAvatarUrl),
        const SizedBox(width: 8.0),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                post.creatorName,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                ),
              ),
              Row(
                children: [
                  Text(
                    '${post.createdAt} • ',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 12.0,
                    ),
                  ),
                  Text(
                    '${post.location} • ',
                    style: TextStyle(
                      color: Colors.grey[700],
                      fontSize: 12.0,
                    ),
                  ),
                  Icon(
                    Icons.public,
                    color: Colors.grey[600],
                    size: 12.0,
                  )
                ],
              ),
            ],
          ),
        ),
        IconButton(
          icon: const Icon(Icons.more_horiz),
          onPressed: () => print('More'),
        ),
      ],
    );
  }
}

class _PostStats extends StatelessWidget {
  final Post post;

  const _PostStats({
    required Key key,
    required this.post,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(4.0),
              decoration: const BoxDecoration(
                color: Color.fromARGB(255, 255, 32, 16),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.favorite_border,
                size: 10.0,
                color: Colors.white,
              ),
            ),
            const SizedBox(width: 4.0),
            Expanded(
              child: Text(
                '${post.likes.length} Likes',
                style: TextStyle(
                  color: Colors.grey[600],
                ),
              ),
            ),
            // Text(
            //   '${post.comments} Comments',
            //   style: TextStyle(
            //     color: Colors.grey[600],
            //   ),
            // ),
            // const SizedBox(width: 8.0),
            // Text(
            //   '${post.shares} Shares',
            //   style: TextStyle(
            //     color: Colors.grey[600],
            //   ),
            // )
          ],
        ),
        const Divider(),
        Row(
          children: [
            _PostButton(
              key: Key('likeButton_${post.id}'),
              icon: Icon(
                MdiIcons.thumbUpOutline,
                color: Colors.grey[600],
                size: 20.0,
              ),
              label: 'Like',
              onTap: () => print(post.likes.length),
            ),
            // _PostButton(
            //   key: Key('commentButton_${post.id}'),
            //   icon: Icon(
            //     MdiIcons.commentOutline,
            //     color: Colors.grey[600],
            //     size: 20.0,
            //   ),
            //   label: 'Comment',
            //   onTap: () => print('Comment'),
            // ),
            _PostButton(
              key: Key('shareButton_${post.id}'),
              icon: Icon(
                MdiIcons.noteEditOutline,
                color: Colors.grey[600],
                size: 25.0,
              ),
              label: 'Save',
              onTap: () => print('Save'),
            )
          ],
        ),
      ],
    );
  }
}

class _PostButton extends StatelessWidget {
  final Icon icon;
  final String label;
  final VoidCallback onTap;

  const _PostButton({
    required Key key,
    required this.icon,
    required this.label,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Material(
        color: Colors.white,
        child: InkWell(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12.0),
            height: 25.0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                icon,
                const SizedBox(width: 4.0),
                Text(label),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
