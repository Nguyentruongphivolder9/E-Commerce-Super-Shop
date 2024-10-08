import '../../../models/account/dto/response/AccountResponse.dart';
import '../../../models/success_response.dart';
import '../../network/http.dart';

class AccountApi {
  late final HttpDio _httpDio = HttpDio();

  Future<AccountResponse> getAccountByAccountId(String id) async {
    try {
      final response = await _httpDio.dio.get(
        'account/get-account-by-id/$id',
      );

      if (response.statusCode == 200  && response.data != null) {
        final responseData = response.data;

        if (responseData == null) {
          throw Exception('Response data is null.');
        }

        if (responseData != null && responseData is Map<String, dynamic>) {
          final successResponse = SuccessResponse<AccountResponse>.fromJson(
            responseData,
                (json) => AccountResponse.fromJson(json as Map<String, dynamic>),
          );

          if (successResponse.body != null) {
            return successResponse.body!;
          } else {
            throw Exception('The body of the response is null.');
          }
        } else {
          throw Exception('Invalid response data format: Expected Map<String, dynamic>, got ${responseData.runtimeType}.');
        }
      } else {
        throw Exception('Request failed with status: ${response.statusCode}, message: ${response.statusMessage}');
      }
    } catch (e) {
      throw Exception('Error fetching account by id: ' + e.toString());
    }
  }
}
