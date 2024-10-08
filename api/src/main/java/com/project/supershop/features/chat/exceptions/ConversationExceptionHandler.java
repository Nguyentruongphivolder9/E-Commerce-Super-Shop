package com.project.supershop.features.chat.exceptions;

import com.project.supershop.handler.UnprocessableException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

//@ControllerAdvice
//public class ConversationExceptionHandler {
//
//    @ExceptionHandler( UnprocessableException.class)
//    public ResponseEntity<String> handleUnprocessableException(UnprocessableException e) {
//        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(e.getMessage());
//    }
//
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<String> handleException(Exception e) {
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal Error");
//    }
//}
