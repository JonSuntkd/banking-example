package com.banking.client.infrastructure.adapter.output.persistence.repository;

import com.banking.client.infrastructure.adapter.output.persistence.entity.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * JPA Repository for ClientEntity
 */
@Repository
public interface ClientJpaRepository extends JpaRepository<ClientEntity, Long> {
    
    /**
     * Find client by person identification
     * @param identification the person identification
     * @return optional client entity
     */
    @Query("SELECT c FROM ClientEntity c JOIN c.person p WHERE p.identification = :identification")
    Optional<ClientEntity> findByPersonIdentification(@Param("identification") String identification);
    
    /**
     * Find all active clients
     * @return list of active clients
     */
    @Query("SELECT c FROM ClientEntity c WHERE c.status = true")
    List<ClientEntity> findAllActive();
    
    /**
     * Check if client exists by person identification
     * @param identification the person identification
     * @return true if client exists
     */
    @Query("SELECT COUNT(c) > 0 FROM ClientEntity c JOIN c.person p WHERE p.identification = :identification")
    boolean existsByPersonIdentification(@Param("identification") String identification);
}