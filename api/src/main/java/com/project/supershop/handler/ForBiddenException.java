package com.project.supershop.handler;

public class ForBiddenException extends RuntimeException {
    public ForBiddenException(String message) {
        super(message);
    }

    public ForBiddenException(String message, Throwable cause) {
        super(message, cause);
    }

    public ForBiddenException(Throwable cause) {
        super(cause);
    }
}
