package com.project.supershop.utils;

import java.util.List;
import java.util.function.Predicate;

public class ArrayUtils {
    public static <T> T findById(List<T> list, Predicate<T> condition) {
        for (T item : list) {
            if (condition.test(item)) {
                return item;
            }
        }
        return null;
    }
}
