package com.project.supershop.features.rating.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RatingFigureResponse {
    private Integer start5;
    private Integer start4;
    private Integer start3;
    private Integer start2;
    private Integer start1;
    private Integer withComment;
    private Integer withPhoto;
}
