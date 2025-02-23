package com.project.supershop.utils;

import java.util.UUID;

public class CheckTypeUUID {
    public static boolean isValidUUID(String str) {
        try {
            UUID uuid = UUID.fromString(str);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
