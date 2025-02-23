import 'package:supershop_app/utils/constants/config.dart';

String generateURLAvatar(String url) {
  if (url.contains('https://lh3.googleusercontent.com')) {
    return url;
  }

  if (url.contains('http://localhost:8080/api/v1/')) {
    Uri uri = Uri.parse(url);

    String avatarPath = uri.path.replaceFirst("/api/v1/", "");
    return Config.baseUrl + avatarPath;
  }

  return '${Config.awsUrl}avatars/$url';
}
