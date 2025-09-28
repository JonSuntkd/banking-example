package com.banking.account.domain.repository;

import com.banking.account.domain.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountNumber(String accountNumber);
    boolean existsByAccountNumber(String accountNumber);
    List<Account> findByClient_ClientId(Long clientId);
    
    @Query(value = "SELECT a.account_number, a.account_type, a.initial_balance, a.status, p.full_name " +
           "FROM account a " +
           "JOIN client c ON a.client_id = c.client_id " +
           "JOIN person p ON c.person_id = p.person_id " +
           "ORDER BY a.account_id", nativeQuery = true)
    List<Object[]> findAllAccountsWithClientNames();
    
    @Query(value = "SELECT a.account_number, a.account_type, a.initial_balance, a.status, p.full_name " +
           "FROM account a " +
           "JOIN client c ON a.client_id = c.client_id " +
           "JOIN person p ON c.person_id = p.person_id " +
           "WHERE a.account_id = ?1", nativeQuery = true)
    List<Object[]> findAccountByIdWithClientName(Long accountId);
}