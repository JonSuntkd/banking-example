package com.banking.client.domain.exception;

/**
 * Exception thrown when a client is not found
 */
public class ClientNotFoundException extends RuntimeException {
    
    public ClientNotFoundException(String message) {
        super(message);
    }
    
    public ClientNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
    
    public static ClientNotFoundException byId(Long clientId) {
        return new ClientNotFoundException(String.format("Client not found with ID: %d", clientId));
    }
    
    public static ClientNotFoundException byIdentification(String identification) {
        return new ClientNotFoundException(String.format("Client not found with identification: %s", identification));
    }
}