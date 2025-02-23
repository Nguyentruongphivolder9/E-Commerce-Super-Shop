package com.project.supershop.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.supershop.common.ResultResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalAuthenticationHandler {

    private final ObjectMapper objectMapper;
    public GlobalAuthenticationHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseBody
    public ResponseEntity<ResultResponse<Object>> handleAccessDeniedException(HttpServletRequest request, AccessDeniedException ex) {
        ResultResponse<Object> resultResponse = ResultResponse.<Object>builder()
                .timeStamp(LocalDateTime.now().toString())
                .body(null)
                .message("Access denied - Please log in")
                .status(HttpStatus.UNAUTHORIZED)
                .statusCode(HttpStatus.UNAUTHORIZED.value())
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resultResponse);
    }
}
