package com.banking.client.infrastructure.adapter.input.rest.dto;

import com.banking.client.domain.model.Gender;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Person response DTO for REST API
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonResponse {
    
    @JsonProperty("personId")
    private Long personId;
    
    @JsonProperty("fullName")
    private String fullName;
    
    @JsonProperty("gender")
    private Gender gender;
    
    @JsonProperty("age")
    private Integer age;
    
    @JsonProperty("identification")
    private String identification;
    
    @JsonProperty("address")
    private String address;
    
    @JsonProperty("phone")
    private String phone;
}