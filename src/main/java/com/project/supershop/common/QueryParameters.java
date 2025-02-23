package com.project.supershop.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QueryParameters {
    private String page;
    private String limit;
    private String sort_by;
    private String category;
    private String name;
    private String order;
    private String price_max;
    private String price_min;
    private String rating_filter;
    private String exclude;
    private String search;
    private String status;
    private String violationType;
    private String condition;
}
