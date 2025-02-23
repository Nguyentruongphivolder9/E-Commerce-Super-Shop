import 'package:flutter/material.dart';

class ProfileSetting extends StatefulWidget {
  @override
  _ProfileSetting createState() => _ProfileSetting();
}

class _ProfileSetting extends State<ProfileSetting> {
  bool _isCollapsed = true;

  double _sideNavWidth = 70;

  // Hàm để thay đổi trạng thái của side navigation
  void _toggleSideNav() {
    setState(() {
      _isCollapsed = !_isCollapsed;
      _sideNavWidth = _isCollapsed ? 70 : 250;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Collapsible SideNav'),
        leading: IconButton(
          icon: Icon(Icons.menu),
          onPressed: () {
            Scaffold.of(context).openDrawer();
          },
        ),
      ),
      drawer: Drawer(
        child: AnimatedContainer(
          duration: Duration(milliseconds: 300),
          width: _sideNavWidth,
          color: Colors.blue,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ListTile(
                leading: Icon(Icons.home, color: Colors.white),
                title: _isCollapsed ? null : Text('Home', style: TextStyle(color: Colors.white)),
                onTap: () {},
              ),
              ListTile(
                leading: Icon(Icons.person, color: Colors.white),
                title: _isCollapsed ? null : Text('Profile', style: TextStyle(color: Colors.white)),
                onTap: () {},
              ),
              ListTile(
                leading: Icon(Icons.settings, color: Colors.white),
                title: _isCollapsed ? null : Text('Settings', style: TextStyle(color: Colors.white)),
                onTap: () {},
              ),
              Spacer(),
              ListTile(
                leading: Icon(Icons.logout, color: Colors.white),
                title: _isCollapsed ? null : Text('Logout', style: TextStyle(color: Colors.white)),
                onTap: () {},
              ),
            ],
          ),
        ),
      ),
      body: Center(
        child: Text('Nội dung chính'),
      ),
    );
  }
}

void main() => runApp(MaterialApp(home: ProfileSetting()));
