package com.project.supershop.features.email.utils;


public class EmailUtils {

    public static String getEmailMessage(String name ,String serverUrl,  String token) {
        return    "Hello"
                + name
                + "\n\n, Your account has been created. Please click the link below to verify your account.\n\n"
                + getVerifycationUrl(serverUrl, token)
                + "\n\nThe support Team";
    }

    public static String getVerifycationUrl(String serverUrl, String token) {
        return serverUrl + "/api/v1/auth/verify-email?token=" + token;
    }
}
