package com.banking.transaction.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, Long> {
    
    @Query("SELECT c FROM ClientEntity c JOIN FETCH c.person p WHERE p.fullName = :clientName")
    Optional<ClientEntity> findByClientName(@Param("clientName") String clientName);
}