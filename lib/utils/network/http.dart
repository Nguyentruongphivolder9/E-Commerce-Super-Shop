import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supershop_app/utils/constants/config.dart';

class HttpDio {
  final Dio _dio;
  String? _accessToken;
  String? _refreshToken;
  Future<String>?
      _refreshTokenRequest; // xử lý các yêu cầu làm mới token đang chờ xử lý

  HttpDio()
      : _dio = Dio(
          BaseOptions(
            baseUrl: Config.baseUrl,
            connectTimeout: const Duration(seconds: 20),
            receiveTimeout: const Duration(seconds: 20),
            headers: {
              'Content-Type': 'application/json',
            },
          ),
        ) {
    _initTokens(); // _initTokens() để khởi tạo các giá trị của _accessToken và _refreshToken từ bộ nhớ cục bộ
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        if (_accessToken != null && _accessToken!.isNotEmpty) {
          options.headers['Authorization'] = 'Bearer $_accessToken';
        }
        return handler.next(options);
      },
      onResponse: (response, handler) {
        final String url = response.requestOptions.path;
        if (url == Config.login || url == Config.register) {
          if (response.data != null && response.data is Map<String, dynamic>) {
            final data = response.data as Map<String, dynamic>;
            if (data.containsKey('body') &&
                data['body'] is Map<String, dynamic>) {
              _accessToken = data['body']['accessToken'].toString();
              _refreshToken = data['body']['refreshToken'].toString();
              _saveTokens();
            } else {
              print(
                  'Error: Response data does not contain the expected structure.');
            }
          } else {
            print(
                'Error: Response data is not a Map<String, dynamic> or is null.');
          }
        } else if (url == Config.logout) {
          _clearTokens();
        }
        return handler.next(response);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          if (error.response?.data['message'] == 'Token expired') {
            _refreshTokenRequest ??= _handleRefreshToken().whenComplete(() {
              _refreshTokenRequest = null;
            });

            try {
              final accessToken = await _refreshTokenRequest!;
              final options = error.requestOptions;
              options.headers['Authorization'] = 'Bearer $accessToken';
              final cloneReq = await _dio.request(
                options.path,
                options: Options(
                  method: options.method,
                  headers: options.headers,
                ),
              );
              return handler.resolve(cloneReq);
            } catch (e) {
              return handler.reject(DioException(
                requestOptions: error.requestOptions,
                response: error.response,
                type: DioExceptionType.badResponse,
                error: e,
              ));
            }
          } else {
            _clearTokens();
          }
        }
        return handler.reject(error);
      },
    ));
  }

  Future<void> _initTokens() async {
    final sharedPreferences = await SharedPreferences.getInstance();
    _accessToken = sharedPreferences.getString('accessToken');
    _refreshToken = sharedPreferences.getString('refreshToken');
  }

  Future<void> _saveTokens() async {
    final sharedPreferences = await SharedPreferences.getInstance();
    if (_accessToken != null) {
      await sharedPreferences.setString('accessToken', _accessToken!);
    }
    if (_refreshToken != null) {
      await sharedPreferences.setString('refreshToken', _refreshToken!);
    }
  }

  Future<void> _clearTokens() async {
    final sharedPreferences = await SharedPreferences.getInstance();
    await sharedPreferences.remove('accessToken');
    await sharedPreferences.remove('refreshToken');
    _accessToken = null;
    _refreshToken = null;
  }

  Future<String> _handleRefreshToken() async {
    final response = await _dio.post('refresh-access-token', data: {
      'refreshToken': _refreshToken,
    });
    _accessToken = response.data['accessToken'];
    await _saveTokens();
    return _accessToken!;
  }

  Dio get dio => _dio;
}
