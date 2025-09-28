package com.banking.client.domain.exception;

/**
 * Exception thrown when client data validation fails
 */
public class InvalidClientDataException extends RuntimeException {
    
    public InvalidClientDataException(String message) {
        super(message);
    }
    
    public InvalidClientDataException(String message, Throwable cause) {
        super(message, cause);
    }
}