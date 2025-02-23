import 'dart:convert';
import 'dart:math';
import 'package:dio/dio.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:supershop_app/common/form_data/Auth/login_form_data.dart';
import 'package:supershop_app/models/account/account.dart';
import 'package:supershop_app/models/account/dto/response/AccountResponse.dart';
import 'package:supershop_app/models/auth/accessToken.dart';
import 'package:supershop_app/models/auth/dto/request/logout_request.dart';
import 'package:supershop_app/models/auth/dto/response/AuthResponse.dart';
import 'package:supershop_app/models/auth/jwtToken.dart';
import 'package:supershop_app/models/success_response.dart';
import 'package:supershop_app/utils/api/WebSocket/WebsocketService.dart';
import 'package:supershop_app/utils/database/database_helper.dart';
import 'package:supershop_app/utils/network/jwt_utils.dart';

import '../../../models/auth/device_info.dart';
import '../../network/http.dart';
import '../Account/account.api.dart';

class AuthApi {
  late final HttpDio _httpDio = HttpDio();
  final AccountApi _accountApi = AccountApi();
  final DatabaseHelper _databaseHelper = DatabaseHelper();
  Future<Account> login(LoginFormData body, DeviceInfo deviceInfo) async {
    try {
      final response = await _httpDio.dio.post(
        'auth/login',
        data: body,
        options: Options(
          headers: {
            "Device-Finger-Print": deviceInfo.deviceFingerPrint,
            "Device-Info": jsonEncode(deviceInfo.toJson()),
          },
        ),
      );

      if (response.statusCode == 200 && response.data != null) {
        final responseData = response.data;

        if (responseData != null && responseData is Map<String, dynamic>) {
          final successResponse = SuccessResponse<AuthResponseBody>.fromJson(
            responseData,
            (json) => AuthResponseBody.fromJson(json as Map<String, dynamic>),
          );

          if (successResponse.body != null) {
            //Handle success
            // AccessToken accessToken = AccessToken(
            //   id: "firstAccessToken",
            //   token: successResponse.body!.accessToken,
            //   refreshToken: successResponse.body!.refreshToken,
            //   expiresIn: successResponse.body!.expires,
            //   issuedAt: DateTime.now().millisecondsSinceEpoch,
            //   expiresAt: DateTime.now()
            //       .add(Duration(seconds: successResponse.body!.expires))
            //       .millisecondsSinceEpoch,
            //   secretKey: new List.empty(),
            // );

            // //Lưu accessToken vào Dâtbase
            // _databaseHelper.saveToken(accessToken.token);

            final decodedToken =
                decodeJwtToken(successResponse.body!.accessToken);

            final accountToSave = Account(
              id: decodedToken['_id'] ?? '',
            );

            AccountResponse accountResponse =
                await _accountApi.getAccountByAccountId(accountToSave.id);

            Account accountReturn = Account(
                id: accountResponse.id,
                userName: accountResponse.userName,
                avatarUrl: accountResponse.avatarUrl,
                roleName: accountResponse.roleName,
                fullName: accountResponse.fullName,
                email: accountResponse.email,
                phoneNumber: accountResponse.phoneNumber,
                birthDay: accountResponse.birthDay.toString(),
                gender: accountResponse.gender,
                isActive: accountResponse.isActive,
                isMerege: accountResponse.isMerege,
                userFullNameChanges: accountResponse.userFullNameChanges,
                provider: accountResponse.provider);
            // print("Account from Db  ${accountReturn.toString()}");
            return accountReturn;
          } else {
            throw Exception('The body of the response is null.');
          }
        } else {
          throw Exception('Invalid response data format.');
        }
      } else {
        throw Exception(
            'Login failed with status: ${response.statusCode}, message: ${response.statusMessage}');
      }
    } catch (e) {
      print("Error during login: ${e.toString()}");
      throw Exception('Login failed: $e');
    }
  }

  final GoogleSignIn _googleSignIn = GoogleSignIn();
  final client_id =
      "376874132858-3eq2triqvn6l40i0smi4c8envtu2soh7.apps.googleusercontent.com";
  final client_secret = "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";
  Future<void> logout(DeviceInfo deviceInfo) async {
    Account? accountFromSqfLite = await _databaseHelper.getAccountFromDb();
    LogoutRequest logoutRequest;
    if (accountFromSqfLite == null) {
      throw Exception("No account logged in the device");
    } else {
      logoutRequest = LogoutRequest(email: accountFromSqfLite.email ?? "");

      if (logoutRequest.email.isEmpty || logoutRequest.email == "") {
        throw Exception("Email is empty, cannot log out");
      }
    }

    try {
      final response = await _httpDio.dio.post(
        'account/account-logout',
        data: logoutRequest.toJson(),
        options: Options(
          headers: {
            "Device-Finger-Print": deviceInfo.deviceFingerPrint,
          },
        ),
      );

      if (response.statusCode == 200 && response.data != null) {
        final responseData = response.data;

        if (responseData != null && responseData is Map<String, dynamic>) {
          final successResponse = SuccessResponse<AuthResponseBody>.fromJson(
            responseData,
            (json) => AuthResponseBody.fromJson(json as Map<String, dynamic>),
          );

          // Xóa accessToken và account khỏi DB
          await _databaseHelper.deleteAccount();
          await _databaseHelper.deleteToken();
        } else {
          throw Exception('Invalid response data format.');
        }
      } else {
        throw Exception(
            'Logout failed with status: ${response.statusCode}, message: ${response.statusMessage}');
      }
    } catch (e) {
      print("Error during logout: ${e.toString()}");
      throw Exception('Logout failed: $e');
    }
  }

  Future<Account?> googleAuthorization() async {
    try {
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) {
        print("Google sign-in was canceled");
        return null; // User canceled the sign-in
      }
      print("=====================> ${googleUser.toString()}");
      // final GoogleSignInAuthentication googleAuth =
      //     await googleUser.authentication;

      // // Create a request to your backend to handle the Google token
      // final response = await _httpDio.dio.post(
      //   'auth/google-login',
      //   data: {
      //     'idToken': googleAuth.idToken,
      //     'accessToken': googleAuth.accessToken,
      //   },
      // );

      // if (response.statusCode == 200) {
      //   // Assuming your API returns the account details
      //   final accountResponse = AccountResponse.fromJson(response.data);
      //   return accountResponse.account; // Assuming your response has an account object
      // } else {
      //   print('Google login failed with status: ${response.statusCode}');
      //   throw Exception('Google login failed: ${response.statusCode}');
      // }
    } catch (error) {
      print("Error during Google sign-in: $error");
      throw Exception('Google sign-in failed: $error');
    }
  }

  Future<JwtResponse?> qrLoginForReact(
      Account account, DeviceInfo deviceFromReact, String code) async {
    print("==========> Account: ${account.toJson()}");
    print("================> Device from React: ${deviceFromReact.toJson()}");

    try {
      final response = await _httpDio.dio.post(
        'auth/qr-scanner-login',
        options: Options(
          headers: {
            "Device-Info": jsonEncode(deviceFromReact.toJson()),
            "Email": account.email,
            "Code": code,
          },
        ),
      );

      print("Response status: ${response.statusCode}, body: ${response.data}");

      if (response.statusCode == 200 && response.data != null) {
        final responseData = response.data;

        if (responseData is Map<String, dynamic>) {
          final successResponse = SuccessResponse<AuthResponseBody>.fromJson(
            responseData,
            (json) => AuthResponseBody.fromJson(json as Map<String, dynamic>),
          );

          if (successResponse.body != null) {
            final jwtResponse = JwtResponse(
              accessToken: successResponse.body!.accessToken,
              refreshToken: successResponse.body!.refreshToken,
              expireRefreshToken: successResponse.body!.expireRefreshToken,
              expires: successResponse.body!.expires,
              secretKey: successResponse.body!.secretKey,
              account: account,
            );

            return jwtResponse;
          } else {
            throw Exception('The body of the response is null.');
          }
        } else {
          throw Exception('Invalid response data format.');
        }
      } else {
        throw Exception(
            'Login failed with status: ${response.statusCode}, message: ${response.statusMessage}');
      }
    } catch (e) {
      print("Error during QR login: ${e.toString()}");
      if (e is DioException) {
        print("DioException: ${e.response?.data}");
      }
      throw Exception('QR login failed: $e');
    }
  }
}
