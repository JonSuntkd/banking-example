package com.banking.client.domain.exception;

/**
 * Exception thrown when trying to create a client that already exists
 */
public class ClientAlreadyExistsException extends RuntimeException {
    
    public ClientAlreadyExistsException(String message) {
        super(message);
    }
    
    public ClientAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public static ClientAlreadyExistsException byIdentification(String identification) {
        return new ClientAlreadyExistsException(
            String.format("Client already exists with identification: %s", identification)
        );
    }
}