package com.banking.client.infrastructure.adapter.input.rest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Simplified Person response DTO for listing clients in REST API
 * Contains only fullName, address and phone fields
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonListResponse {
    
    @JsonProperty("fullName")
    private String fullName;
    
    @JsonProperty("address")
    private String address;
    
    @JsonProperty("phone")
    private String phone;
}