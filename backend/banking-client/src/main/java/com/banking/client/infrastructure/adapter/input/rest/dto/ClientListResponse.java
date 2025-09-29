package com.banking.client.infrastructure.adapter.input.rest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Client list response DTO for REST API
 * Used specifically for the getAllClients endpoint with simplified format
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientListResponse {
    
    @JsonProperty("person")
    private PersonListResponse person;
    
    @JsonProperty("password")
    private String password;
    
    @JsonProperty("status")
    private Boolean status;
}