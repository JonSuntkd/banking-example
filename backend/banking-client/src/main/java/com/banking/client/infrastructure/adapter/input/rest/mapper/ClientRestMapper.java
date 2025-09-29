package com.banking.client.infrastructure.adapter.input.rest.mapper;

import com.banking.client.domain.model.Client;
import com.banking.client.infrastructure.adapter.input.rest.dto.BasicClientRequest;
import com.banking.client.infrastructure.adapter.input.rest.dto.ClientRequest;
import com.banking.client.infrastructure.adapter.input.rest.dto.ClientResponse;
import com.banking.client.infrastructure.adapter.input.rest.dto.ClientListResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * MapStruct mapper for converting between Client domain model and REST DTOs
 */
@Mapper(
    componentModel = "spring", 
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = PersonRestMapper.class
)
public interface ClientRestMapper {
    
    /**
     * Converts ClientRequest DTO to Client domain model
     * @param clientRequest the request DTO
     * @return the domain model
     */
    @Mapping(target = "clientId", ignore = true)
    Client toDomain(ClientRequest clientRequest);
    
    /**
     * Converts BasicClientRequest DTO to Client domain model
     * @param basicClientRequest the basic request DTO
     * @return the domain model
     */
    @Mapping(target = "clientId", ignore = true)
    @Mapping(target = "person.personId", ignore = true)
    @Mapping(target = "person.fullName", source = "fullName")
    @Mapping(target = "person.address", source = "address")
    @Mapping(target = "person.phone", source = "phone")
    @Mapping(target = "person.gender", ignore = true)
    @Mapping(target = "person.age", ignore = true)
    @Mapping(target = "person.identification", ignore = true)
    Client toDomainFromBasic(BasicClientRequest basicClientRequest);
    
    /**
     * Converts Client domain model to ClientResponse DTO
     * @param client the domain model
     * @return the response DTO
     */
    ClientResponse toResponse(Client client);
    
    /**
     * Converts list of Client domain models to list of ClientResponse DTOs
     * @param clients the list of domain models
     * @return the list of response DTOs
     */
    List<ClientResponse> toResponseList(List<Client> clients);
    
    /**
     * Converts Client domain model to ClientListResponse DTO for listing
     * @param client the domain model
     * @return the list response DTO
     */
    @Mapping(target = "person", source = "person")
    ClientListResponse toListResponse(Client client);
    
    /**
     * Converts list of Client domain models to list of ClientListResponse DTOs
     * @param clients the list of domain models
     * @return the list of list response DTOs
     */
    List<ClientListResponse> toListResponseList(List<Client> clients);
}