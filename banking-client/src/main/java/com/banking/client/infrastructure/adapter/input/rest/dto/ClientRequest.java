package com.banking.client.infrastructure.adapter.input.rest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Client request DTO for REST API
 * Updated validation rules according to new database schema
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientRequest {
    
    @Valid
    @NotNull(message = "Person information is required")
    @JsonProperty("person")
    private PersonRequest person;
    
    @NotBlank(message = "Password is required")  // OBLIGATORIO
    @Size(min = 4, message = "Password must be at least 4 characters long")
    @JsonProperty("password")
    private String password;
    
    @NotNull(message = "Status is required")  // OBLIGATORIO - agregado @NotNull
    @JsonProperty("status")
    private Boolean status;
}