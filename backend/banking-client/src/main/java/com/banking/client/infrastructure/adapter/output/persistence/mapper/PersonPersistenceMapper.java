package com.banking.client.infrastructure.adapter.output.persistence.mapper;

import com.banking.client.domain.model.Person;
import com.banking.client.infrastructure.adapter.output.persistence.entity.PersonEntity;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

/**
 * MapStruct mapper for converting between Person domain model and PersonEntity
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PersonPersistenceMapper {
    
    /**
     * Converts Person domain model to PersonEntity
     * @param person the domain model
     * @return the JPA entity
     */
    PersonEntity toEntity(Person person);
    
    /**
     * Converts PersonEntity to Person domain model
     * @param personEntity the JPA entity
     * @return the domain model
     */
    Person toDomain(PersonEntity personEntity);
}