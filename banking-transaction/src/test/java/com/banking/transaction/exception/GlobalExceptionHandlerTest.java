package com.banking.transaction.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    @InjectMocks
    private GlobalExceptionHandler globalExceptionHandler;

    @BeforeEach
    void setUp() {
        globalExceptionHandler = new GlobalExceptionHandler();
    }

    @Test
    void handleRuntimeException_ShouldReturnBadRequest() {
        // Given
        String errorMessage = "La cuenta no existe";
        RuntimeException exception = new RuntimeException(errorMessage);

        // When
        ResponseEntity<GlobalExceptionHandler.ErrorResponse> response = 
                globalExceptionHandler.handleRuntimeException(exception);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("ERROR");
        assertThat(response.getBody().getMessage()).isEqualTo(errorMessage);
    }

    @Test
    void handleRuntimeException_ShouldHandleInsufficientFundsError() {
        // Given
        String errorMessage = "No se puede realizar esta transacción por falta de dinero";
        RuntimeException exception = new RuntimeException(errorMessage);

        // When
        ResponseEntity<GlobalExceptionHandler.ErrorResponse> response = 
                globalExceptionHandler.handleRuntimeException(exception);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("ERROR");
        assertThat(response.getBody().getMessage()).isEqualTo(errorMessage);
    }

    @Test
    void handleRuntimeException_ShouldHandleInvalidTransactionTypeError() {
        // Given
        String errorMessage = "Tipo de transacción inválido";
        RuntimeException exception = new RuntimeException(errorMessage);

        // When
        ResponseEntity<GlobalExceptionHandler.ErrorResponse> response = 
                globalExceptionHandler.handleRuntimeException(exception);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("ERROR");
        assertThat(response.getBody().getMessage()).isEqualTo(errorMessage);
    }

    @Test
    void errorResponse_ShouldWorkCorrectly() {
        // Given
        String status = "ERROR";
        String message = "Test error message";

        // When
        GlobalExceptionHandler.ErrorResponse errorResponse = 
                new GlobalExceptionHandler.ErrorResponse(status, message);

        // Then
        assertThat(errorResponse.getStatus()).isEqualTo(status);
        assertThat(errorResponse.getMessage()).isEqualTo(message);

        // Test setters
        errorResponse.setStatus("WARNING");
        errorResponse.setMessage("New message");
        
        assertThat(errorResponse.getStatus()).isEqualTo("WARNING");
        assertThat(errorResponse.getMessage()).isEqualTo("New message");
    }
}