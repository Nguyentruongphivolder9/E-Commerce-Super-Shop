import 'package:flutter/material.dart';
import 'package:supershop_app/features/social/components/profile_avatar.dart';
import 'package:supershop_app/features/social/screens/create_post_screen.dart';
import 'package:supershop_app/models/account/account.dart';

class CreatePostContainer extends StatelessWidget {
  final Account currentUser;

  const CreatePostContainer({
    super.key,
    required this.currentUser,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 0.0),
      elevation: 0.0,
      child: Container(
        padding: const EdgeInsets.fromLTRB(12.0, 8.0, 12.0, 0.0),
        color: Colors.white,
        child: Column(
          children: [
            Row(
              children: [
                ProfileAvatar(
                    key: const Key('profile_avatar'),
                    imageUrl: currentUser.avatarUrl ?? ''),
                const SizedBox(width: 8.0),
                const Expanded(
                  child: TextField(
                    decoration: InputDecoration.collapsed(
                      hintText: 'What\'s on your mind?',
                    ),
                  ),
                )
              ],
            ),
            const Divider(height: 10.0, thickness: 0.5),
            SizedBox(
              height: 40.0,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  TextButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => CreatePostScreen()),
                      );
                    },
                    icon: const Icon(
                      Icons.create,
                      color: Colors.blueAccent,
                    ),
                    label: const Text('Create Post'),
                  ),
                  // const VerticalDivider(width: 8.0),
                  // TextButton.icon(
                  //   onPressed: () => print('Photo'),
                  //   icon: const Icon(
                  //     Icons.photo_library,
                  //     color: Colors.green,
                  //   ),
                  //   label: const Text('Photo'),
                  // ),
                  // const VerticalDivider(width: 8.0),
                  // TextButton.icon(
                  //   onPressed: () => print('Room'),
                  //   icon: const Icon(
                  //     Icons.video_call,
                  //     color: Colors.purpleAccent,
                  //   ),
                  //   label: const Text('Room'),
                  // ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
