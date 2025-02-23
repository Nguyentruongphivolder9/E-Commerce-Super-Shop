import 'package:dio/dio.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:supershop_app/features/checkout/const_stripe.dart';

class StripeService {
  StripeService._();

  static final StripeService instance = StripeService._();
  static var paymentIntentId = '';

  Future<void> makePayment(int amount) async {
    try {
      String? paymentIntentClientSecret = await _createPayment(amount, "vnd");
      if (paymentIntentClientSecret == null) return;
      await Stripe.instance.initPaymentSheet(
        paymentSheetParameters: SetupPaymentSheetParameters(
          paymentIntentClientSecret: paymentIntentClientSecret,
          merchantDisplayName: "Hussain Mustafa",
          billingDetailsCollectionConfiguration: const BillingDetailsCollectionConfiguration(
            address: AddressCollectionMode.never,
          ),
        ),
      );
      await _processPayment();
    } catch (e) {
      rethrow;
    }
  }

  Future<String?> _createPayment(int amount, String currency) async {
    try {
      final Dio dio = Dio();
      Map<String, dynamic> data = {
        "amount": amount,
        "currency": currency,
      };
      var response = await dio.post(
        "https://api.stripe.com/v1/payment_intents",
        data: data,
        options: Options(
          contentType: Headers.formUrlEncodedContentType,
          headers: {
            "Authorization": "Bearer $stripeSecretKey",
            "Content-Type": "application/x-www-form-urlencoded"
          },
        ),
      );
      if (response != null) {
        paymentIntentId = response.data['id'];
        return response.data['client_secret'];
      }
      return null;
    } catch (e) {
      rethrow;
    }
  }

  Future<void> _processPayment() async {
    try {
      await Stripe.instance.presentPaymentSheet();
    } catch (e) {
      rethrow;
    }
  }
}
