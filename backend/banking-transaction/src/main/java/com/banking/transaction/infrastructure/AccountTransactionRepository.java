package com.banking.transaction.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AccountTransactionRepository extends JpaRepository<AccountTransactionEntity, Long> {
    
    @Query("SELECT at FROM AccountTransactionEntity at JOIN FETCH at.account")
    List<AccountTransactionEntity> findAllWithAccount();
    
    @Query("SELECT at FROM AccountTransactionEntity at JOIN FETCH at.account " +
           "WHERE DATE(at.transactionDate) = :transactionDate")
    List<AccountTransactionEntity> findByTransactionDate(@Param("transactionDate") LocalDate transactionDate);
}
