package com.banking.client.infrastructure.adapter.output.persistence.mapper;

import com.banking.client.domain.model.Client;
import com.banking.client.infrastructure.adapter.output.persistence.entity.ClientEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

/**
 * MapStruct mapper for converting between Client domain model and ClientEntity
 */
@Mapper(
    componentModel = "spring", 
    unmappedTargetPolicy = ReportingPolicy.IGNORE,
    uses = PersonPersistenceMapper.class
)
public interface ClientPersistenceMapper {
    
    /**
     * Converts Client domain model to ClientEntity
     * @param client the domain model
     * @return the JPA entity
     */
    ClientEntity toEntity(Client client);
    
    /**
     * Converts ClientEntity to Client domain model
     * @param clientEntity the JPA entity
     * @return the domain model
     */
    Client toDomain(ClientEntity clientEntity);
}