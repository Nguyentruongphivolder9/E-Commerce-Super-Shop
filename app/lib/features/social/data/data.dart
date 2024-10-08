import 'dart:core';

import 'package:supershop_app/models/account/account.dart';
import 'package:supershop_app/models/social/post.dart';
import 'package:supershop_app/models/social/post_image.dart';

final Account currentUser = Account(
  id: '1',
  userName: 'johndoe',
  avatarUrl: 'https://example.com/avatar.jpg',
  roleName: 'user',
  fullName: 'John Doe',
  email: 'johndoe@example.com',
  phoneNumber: '123-456-7890',
  birthDay: '1990-01-01',
  gender: 'Male',
  isActive: true,
  isLoggedOut: false,
  isEnable: true,
  isMerege: false,
  userFullNameChanges: 1,
  provider: 'google',
);

final List<Account> onlineUsers = <Account>[
  Account(
    id: '2',
    userName: 'johndoe2',
    avatarUrl: 'https://example.com/avatar.jpg',
    roleName: 'user',
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phoneNumber: '123-456-7890',
    birthDay: '1990-01-01',
    gender: 'Male',
    isActive: true,
    isLoggedOut: false,
    isEnable: true,
    isMerege: false,
    userFullNameChanges: 1,
    provider: 'google',
  ),
  // Add more Account objects as needed
];

// List<Post> posts = [
//   Post(
//     id: '101',
//     caption: 'Beautiful sunset at the beach',
//     tags: "ahihi",
//     location: 'Miami Beach, FL',
//     creatorId: '2',
//     creatorName: 'John Doe',
//     creatorAvatarUrl: 'https://example.com/avatar.jpg',
//     likes: [],
//     postImageResponses: [
//       PostImage(
//         id: '201',
//         postId: "101",
//         imageUrl: 'https://example.com/avatar.jpg',
//       ),
//     ],
//     createdAt: '',
//     updatedAt: '',
//   ),
//   Post(
//     id: '102',
//     caption: 'Hiking in the mountains',
//     tags: "ahihi",
//     location: 'Rocky Mountains, CO',
//     creatorId: '3',
//     creatorName: 'Jane Doe',
//     creatorAvatarUrl: 'https://example.com/avatar.jpg',
//     likes: [],
//     postImageResponses: [
//       PostImage(
//         id: '202',
//         postId: "102",
//         imageUrl: 'https://example.com/avatar.jpg',
//       ),
//     ],
//     createdAt: '',
//     updatedAt: '',
//   ),
// ];
