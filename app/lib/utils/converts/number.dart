import 'package:intl/intl.dart';
import 'package:supershop_app/models/product/product_variant.dart';

String formatCurrency(double currency) {
  return NumberFormat.currency(
    locale: 'de_DE',
    symbol: '',
    decimalDigits: 0,
  ).format(currency);
}

String formatNumberToSocialStyle(int value) {
  final formatter = NumberFormat.compact(locale: 'en');
  String formattedValue = formatter.format(value);

  formattedValue = formattedValue.replaceAll(',', '.').toLowerCase();

  return formattedValue;
}

double calculateLowestPrice(List<ProductVariant> productVariants) {
  if (productVariants.isEmpty) return 0.0;

  return productVariants.map((variant) => variant.price).reduce(
      (lowestPrice, price) => price < lowestPrice ? price : lowestPrice);
}

double calculateHighestPrice(List<ProductVariant> productVariants) {
  if (productVariants.isEmpty) return 0.0;

  return productVariants.map((variant) => variant.price).reduce(
      (highestPrice, price) => price > highestPrice ? price : highestPrice);
}

String calculateFromToPrice(List<ProductVariant> productVariants) {
  final highestPrice = calculateHighestPrice(productVariants);
  final lowestPrice = calculateLowestPrice(productVariants);

  if (highestPrice == lowestPrice) {
    return '₫${formatCurrency(lowestPrice)}';
  }

  return '₫${formatCurrency(lowestPrice)} - ₫${formatCurrency(highestPrice)}';
}

int calculateTotalStockQuantity(List<ProductVariant> productVariants) {
  return productVariants.fold(
      0, (total, variant) => total + variant.stockQuantity);
}
