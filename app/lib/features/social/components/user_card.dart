import 'package:flutter/material.dart';

import 'package:supershop_app/features/social/components/components.dart';
import 'package:supershop_app/models/account/account.dart';

class UserCard extends StatelessWidget {
  final Account user;

  const UserCard({
    super.key,
    required this.user,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () {},
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          ProfileAvatar(key: Key(user.id), imageUrl: user.avatarUrl ?? ''),
          const SizedBox(width: 6.0),
          Flexible(
            child: Text(
              user.userName ?? 'Unknown',
              style: const TextStyle(fontSize: 16.0),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
