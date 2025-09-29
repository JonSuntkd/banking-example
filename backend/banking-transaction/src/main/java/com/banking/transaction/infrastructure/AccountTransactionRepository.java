package com.banking.transaction.infrastructure;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AccountTransactionRepository extends JpaRepository<AccountTransactionEntity, Long> {
    
    @Query("SELECT at FROM AccountTransactionEntity at JOIN FETCH at.account")
    List<AccountTransactionEntity> findAllWithAccount();
    
    @Query("SELECT at FROM AccountTransactionEntity at JOIN FETCH at.account " +
           "WHERE DATE(at.transactionDate) = :transactionDate")
    List<AccountTransactionEntity> findByTransactionDate(@Param("transactionDate") LocalDate transactionDate);
    
    @Query("SELECT at FROM AccountTransactionEntity at " +
           "WHERE at.account.accountId = :accountId " +
           "AND DATE(at.transactionDate) BETWEEN :startDate AND :endDate " +
           "ORDER BY at.transactionDate ASC")
    List<AccountTransactionEntity> findByAccountIdAndDateRange(@Param("accountId") Long accountId,
                                                             @Param("startDate") LocalDate startDate,
                                                             @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COALESCE(SUM(CASE WHEN at.transactionType = 'DEBITO' THEN at.amount ELSE 0 END), 0) " +
           "FROM AccountTransactionEntity at " +
           "WHERE at.account.accountId = :accountId " +
           "AND DATE(at.transactionDate) BETWEEN :startDate AND :endDate")
    BigDecimal getTotalDebitsByAccountAndDateRange(@Param("accountId") Long accountId,
                                                 @Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COALESCE(SUM(CASE WHEN at.transactionType = 'CREDITO' THEN at.amount ELSE 0 END), 0) " +
           "FROM AccountTransactionEntity at " +
           "WHERE at.account.accountId = :accountId " +
           "AND DATE(at.transactionDate) BETWEEN :startDate AND :endDate")
    BigDecimal getTotalCreditsByAccountAndDateRange(@Param("accountId") Long accountId,
                                                  @Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate);
}
