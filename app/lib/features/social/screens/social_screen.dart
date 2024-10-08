import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:material_design_icons_flutter/material_design_icons_flutter.dart';
import 'package:provider/provider.dart';
import 'package:supershop_app/common/screens/loading_screen.dart';
import 'package:supershop_app/common/screens/not_found_screen.dart';
import 'package:supershop_app/features/social/components/components.dart';
import 'package:supershop_app/features/social/config/palette.dart';
import 'package:supershop_app/models/image_slider.dart';
import 'package:supershop_app/models/social/post.dart';

import "package:supershop_app/features/social/data/data.dart";
import 'package:supershop_app/providers/social.provider.dart';

class SocialScreen extends StatefulWidget {
  const SocialScreen({super.key});

  @override
  State<StatefulWidget> createState() => _SocialScreenState();
}

class _SocialScreenState extends State<SocialScreen> {
  final TrackingScrollController _trackingScrollController =
      TrackingScrollController();
  final ScrollController _scrollController = ScrollController();
  final ValueNotifier<bool> _isCollapsed = ValueNotifier(false);

  bool isLoading = false;
  List<ImageSlider> imagesSlider = [];
  int currentImage = 1;

  @override
  void initState() {
    super.initState();
    _fetchPosts();
    _scrollController.addListener(() {
      if (_scrollController.offset >= (240 - kToolbarHeight)) {
        _isCollapsed.value = true;
      } else {
        _isCollapsed.value = false;
      }

      // Refetch posts when scrolled to the bottom
      if (_scrollController.position.atEdge) {
        if (_scrollController.position.pixels != 0) {
          _fetchPosts();
        }
      }
    });
  }

  void _refetchPosts() {
    final provider = Provider.of<SocialProvider>(context, listen: false);
    provider.getRecentPosts();
  }

  @override
  void dispose() {
    _trackingScrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final posts = Provider.of<SocialProvider>(context).listPost;

    if (isLoading) {
      return const LoadingScreen();
    }

    if (!isLoading && posts.isEmpty) {
      return const NotFoundScreen();
    }

    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(),
      child: Scaffold(
        body: Responsive(
          mobile: _SocialScreenMobile(
            scrollController: _trackingScrollController,
            fetchPosts: _fetchPosts,
          ),
        ),
      ),
    );
  }

  Future<void> _fetchPosts() async {
    final provider = Provider.of<SocialProvider>(context, listen: false);
    setState(() {
      isLoading = true;
    });
    await provider.getRecentPosts();
    setState(() {
      isLoading = false;
    });
  }
}

class _SocialScreenMobile extends StatelessWidget {
  final TrackingScrollController scrollController;
  final VoidCallback fetchPosts;

  const _SocialScreenMobile({
    required this.scrollController,
    required this.fetchPosts,
  });

  @override
  Widget build(BuildContext context) {
    final posts = Provider.of<SocialProvider>(context).listPost;

    return CustomScrollView(
      controller: scrollController,
      slivers: [
        SliverAppBar(
          backgroundColor: Colors.white,
          title: const Text(
            'SuperShop',
            style: TextStyle(
              color: Palette.facebookBlue,
              fontSize: 28.0,
              fontWeight: FontWeight.bold,
              letterSpacing: -1.2,
            ),
          ),
          centerTitle: false,
          floating: true,
          actions: [
            CircleButton(
              icon: Icons.post_add,
              iconSize: 30.0,
              onPressed: fetchPosts,
            ),
            // CircleButton(
            //   icon: MdiIcons.facebookMessenger,
            //   iconSize: 30.0,
            //   onPressed: () => print('Messenger'),
            // ),
          ],
          systemOverlayStyle: SystemUiOverlayStyle.dark,
        ),
        SliverToBoxAdapter(
          child: CreatePostContainer(currentUser: currentUser),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(0.0, 10.0, 0.0, 5.0),
          sliver: SliverToBoxAdapter(
            child: Rooms(onlineUsers: onlineUsers),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(0.0, 5.0, 0.0, 5.0),
          sliver: SliverToBoxAdapter(
            child: Stories(
              currentUser: currentUser,
              posts: posts,
            ),
          ),
        ),
        SliverList(
          delegate: SliverChildBuilderDelegate(
            (context, index) {
              final Post post = posts[index];
              return PostContainer(post: post);
            },
            childCount: posts.length,
          ),
        ),
      ],
    );
  }
}
