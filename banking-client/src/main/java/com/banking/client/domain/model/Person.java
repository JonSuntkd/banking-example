package com.banking.client.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Person domain model representing a person entity
 * Following Clean Code and SOLID principles
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Person {
    
    private Long personId;
    private String fullName;
    private Gender gender;
    private Integer age;
    private String identification;
    private String address;
    private String phone;
    
    /**
     * Validates person data according to business rules
     * Updated to match new database schema requirements
     * @return true if person data is valid
     */
    public boolean isValid() {
        // OBLIGATORIOS: fullName, address, phone
        boolean requiredFieldsValid = fullName != null && !fullName.trim().isEmpty()
            && address != null && !address.trim().isEmpty()
            && phone != null && !phone.trim().isEmpty();
        
        // OPCIONALES: gender, age, identification (pueden ser null)
        boolean optionalFieldsValid = true;
        
        // Si age está presente, debe ser >= 0
        if (age != null) {
            optionalFieldsValid = age >= 0;
        }
        
        return requiredFieldsValid && optionalFieldsValid;
    }
    
    /**
     * Gets full display name for the person
     * @return formatted full name
     */
    public String getDisplayName() {
        return fullName != null ? fullName.trim() : "";
    }
}