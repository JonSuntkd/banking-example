package com.banking.client.infrastructure.adapter.input.rest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Client response DTO for REST API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientResponse {
    
    @JsonProperty("clientId")
    private Long clientId;
    
    @JsonProperty("person")
    private PersonResponse person;
    
    @JsonProperty("status")
    private Boolean status;
}