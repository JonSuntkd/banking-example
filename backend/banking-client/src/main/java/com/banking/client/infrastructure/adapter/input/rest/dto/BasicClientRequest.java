package com.banking.client.infrastructure.adapter.input.rest.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Basic Client Request DTO for simplified client registration
 * Contains only the essential required fields
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BasicClientRequest {
    
    @NotBlank(message = "Full name is required")
    private String fullName;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^\\+593-\\d{2}-\\d{3}-\\d{4}$", 
             message = "Phone must follow the format +593-XX-XXX-XXXX")
    private String phone;
    
    @NotBlank(message = "Password is required")
    private String password;
    
    @NotNull(message = "Status is required")
    private Boolean status;
}