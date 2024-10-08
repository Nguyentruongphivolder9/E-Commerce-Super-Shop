import 'package:json_annotation/json_annotation.dart';
import 'package:supershop_app/models/rating/rating.dart';

part '../../generated/rating/rating_figure.g.dart';

@JsonSerializable()
class RatingFigure {
  int start5;
  int start4;
  int start3;
  int start2;
  int start1;
  int withComment;
  int withPhoto;
  RatingFigure({
    required this.start5,
    required this.start4,
    required this.start3,
    required this.start2,
    required this.start1,
    required this.withComment,
    required this.withPhoto,
  });

  factory RatingFigure.fromJson(Map<String, dynamic> json) =>
      _$RatingFigureFromJson(json);
}
