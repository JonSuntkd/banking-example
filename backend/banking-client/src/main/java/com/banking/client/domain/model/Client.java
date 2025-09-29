package com.banking.client.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Client domain model representing a banking client
 * Following Clean Code and SOLID principles
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    
    private Long clientId;
    private Person person;
    private String password;
    private Boolean status;
    
    /**
     * Validates client data according to business rules
     * @return true if client data is valid
     */
    public boolean isValid() {
        return person != null && person.isValid()
            && password != null && !password.trim().isEmpty()
            && password.length() >= 4; // Minimum password length requirement
    }
    
    /**
     * Checks if client is active
     * @return true if client is active
     */
    public boolean isActive() {
        return status != null && status;
    }
    
    /**
     * Activates the client
     */
    public void activate() {
        this.status = true;
    }
    
    /**
     * Deactivates the client
     */
    public void deactivate() {
        this.status = false;
    }
    
    /**
     * Gets client's full name from person information
     * @return client's full name
     */
    public String getFullName() {
        return person != null ? person.getDisplayName() : "";
    }
    
    /**
     * Gets client's identification from person information
     * @return client's identification or empty string if null
     */
    public String getIdentification() {
        return person != null && person.getIdentification() != null ? person.getIdentification() : "";
    }
}