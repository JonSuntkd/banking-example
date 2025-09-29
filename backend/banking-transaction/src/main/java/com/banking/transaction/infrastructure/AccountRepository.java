package com.banking.transaction.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<AccountEntity, Long> {
    @Query("SELECT a FROM AccountEntity a WHERE a.accountNumber = :accountNumber")
    Optional<AccountEntity> findByAccountNumber(String accountNumber);
    
    @Query("SELECT a FROM AccountEntity a WHERE a.client.clientId = :clientId")
    List<AccountEntity> findByClientId(@Param("clientId") Long clientId);
}
