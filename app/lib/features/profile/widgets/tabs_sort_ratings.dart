import 'package:flutter/material.dart';
import 'package:supershop_app/utils/constants/colors.dart';
import 'package:supershop_app/utils/constants/sizes.dart';

class TabsSortRatings extends StatefulWidget {
  const TabsSortRatings({super.key});

  @override
  State<TabsSortRatings> createState() => _TabsSortRatingsState();
}

class _TabsSortRatingsState extends State<TabsSortRatings> {
  String currentTab = "toRate";

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 35,
      width: double.infinity,
      child: Row(
        children: [
          Expanded(
            child: InkWell(
              onTap: () {
                setState(() {
                  currentTab = 'toRate';
                });
              },
              splashColor: Colors.transparent,
              highlightColor: Colors.transparent,
              child: Center(
                child: Container(
                  height: double.infinity,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: ColorsString.white,
                    border: Border(
                      bottom: BorderSide(
                        color: currentTab == 'toRate'
                            ? ColorsString.primary
                            : ColorsString.grey,
                        width: currentTab == 'toRate' ? 2.0 : 1.0,
                      ),
                    ),
                  ),
                  child: Center(
                    child: Text(
                      'To Rate',
                      style: TextStyle(
                        color: currentTab == 'toRate'
                            ? ColorsString.primary
                            : ColorsString.dark,
                        fontSize: Sizes.fontSizeMd,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: InkWell(
              onTap: () {
                setState(() {
                  currentTab = 'myReviews';
                });
              },
              splashColor: Colors.transparent,
              highlightColor: Colors.transparent,
              child: Center(
                child: Container(
                  height: double.infinity,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: ColorsString.white,
                    border: Border(
                      bottom: BorderSide(
                        color: currentTab == 'myReviews'
                            ? ColorsString.primary
                            : ColorsString.grey,
                        width: currentTab == 'myReviews' ? 2.0 : 1.0,
                      ),
                    ),
                  ),
                  child: Center(
                    child: Text(
                      'My Reviews',
                      style: TextStyle(
                        color: currentTab == 'myReviews'
                            ? ColorsString.primary
                            : ColorsString.dark,
                        fontSize: Sizes.fontSizeMd,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: InkWell(
              onTap: () {
                setState(() {
                  currentTab = 'buyerRating';
                });
              },
              splashColor: Colors.transparent,
              highlightColor: Colors.transparent,
              child: Center(
                child: Container(
                  height: double.infinity,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: ColorsString.white,
                    border: Border(
                      bottom: BorderSide(
                        color: currentTab == 'buyerRating'
                            ? ColorsString.primary
                            : ColorsString.grey,
                        width: currentTab == 'buyerRating' ? 2.0 : 1.0,
                      ),
                    ),
                  ),
                  child: Center(
                    child: Text(
                      'Buyer Rating',
                      style: TextStyle(
                        color: currentTab == 'buyerRating'
                            ? ColorsString.primary
                            : ColorsString.dark,
                        fontSize: Sizes.fontSizeMd,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
