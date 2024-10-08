import 'package:intl/intl.dart';

import '../../models/account/dto/response/AccountResponse.dart';

String formatDateTime(String date) {
  final DateTime convertDate = DateTime.parse(date);
  return DateFormat('yyyy-MM-dd kk:mm').format(convertDate);
}

String formatBirthDay(String birthDateString) {
  if (birthDateString == null || birthDateString.isEmpty) {
    return " ";
  }
  try {
    final date = DateTime.parse(birthDateString);
    final formattedDate = DateFormat('yyyy-MM-dd').format(date);
    return formattedDate;
  } catch (e) {
    return " ";
  }
}
