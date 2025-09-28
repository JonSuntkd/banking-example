package com.banking.client.infrastructure.adapter.input.rest.mapper;

import com.banking.client.domain.model.Person;
import com.banking.client.infrastructure.adapter.input.rest.dto.PersonRequest;
import com.banking.client.infrastructure.adapter.input.rest.dto.PersonResponse;
import com.banking.client.infrastructure.adapter.input.rest.dto.PersonListResponse;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

/**
 * MapStruct mapper for converting between Person domain model and REST DTOs
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PersonRestMapper {
    
    /**
     * Converts PersonRequest DTO to Person domain model
     * @param personRequest the request DTO
     * @return the domain model
     */
    Person toDomain(PersonRequest personRequest);
    
    /**
     * Converts Person domain model to PersonResponse DTO
     * @param person the domain model
     * @return the response DTO
     */
    PersonResponse toResponse(Person person);
    
    /**
     * Converts Person domain model to PersonListResponse DTO
     * @param person the domain model
     * @return the list response DTO
     */
    PersonListResponse toListResponse(Person person);
}