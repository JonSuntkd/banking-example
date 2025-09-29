package com.banking.client.infrastructure.adapter.input.rest.dto;

import com.banking.client.domain.model.Gender;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Person request DTO for REST API
 * Updated validation rules according to new database schema
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonRequest {
    
    @NotBlank(message = "Full name is required")  // OBLIGATORIO
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    @JsonProperty("fullName")
    private String fullName;
    
    @JsonProperty("gender")  // OPCIONAL - removido @NotNull
    private Gender gender;
    
    @Min(value = 0, message = "Age must be positive")  // OPCIONAL - removido @NotNull
    @Max(value = 150, message = "Age must be realistic")
    @JsonProperty("age")
    private Integer age;
    
    @Size(max = 50, message = "Identification cannot exceed 50 characters")  // OPCIONAL - removido @NotBlank
    @JsonProperty("identification")
    private String identification;
    
    @NotBlank(message = "Address is required")  // OBLIGATORIO - agregado @NotBlank
    @Size(max = 255, message = "Address cannot exceed 255 characters")
    @JsonProperty("address")
    private String address;
    
    @NotBlank(message = "Phone is required")  // OBLIGATORIO - agregado @NotBlank
    @Size(max = 20, message = "Phone cannot exceed 20 characters")
    @Pattern(regexp = "^[+]?[0-9\\-\\s\\(\\)]*$", message = "Phone format is invalid")
    @JsonProperty("phone")
    private String phone;
}