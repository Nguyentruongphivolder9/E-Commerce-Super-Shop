package com.project.supershop.features.product.domain.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.joda.time.DateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class HistoryViolationResponse {
    private String id;
    private TypeViolationResponse typeViolation;
    private String reasons;
    private String suggest;
    private String deadline;
    private Boolean isRepaired;
    private String prevStatus;
    private String createdAt;
    private String updatedAt;
}
