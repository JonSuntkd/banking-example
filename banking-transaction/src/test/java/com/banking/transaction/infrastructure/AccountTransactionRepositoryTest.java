package com.banking.transaction.infrastructure;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class AccountTransactionRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private AccountTransactionRepository transactionRepository;

    private AccountEntity accountEntity;
    private AccountTransactionEntity transactionEntity;

    @BeforeEach
    void setUp() {
        accountEntity = new AccountEntity();
        accountEntity.setAccountNumber("225487");
        accountEntity.setAccountType("Corriente");
        accountEntity.setInitialBalance(BigDecimal.valueOf(1000.00));
        accountEntity.setStatus(true);
        
        transactionEntity = new AccountTransactionEntity();
        transactionEntity.setTransactionType("Deposito");
        transactionEntity.setAmount(BigDecimal.valueOf(575.00));
        transactionEntity.setBalance(BigDecimal.valueOf(1575.00));
        transactionEntity.setTransactionDate(LocalDateTime.now());
        transactionEntity.setAccount(accountEntity);
    }

    @Test
    void save_ShouldPersistTransaction() {
        // Given
        AccountEntity persistedAccount = entityManager.persistAndFlush(accountEntity);
        transactionEntity.setAccount(persistedAccount);

        // When
        AccountTransactionEntity savedTransaction = transactionRepository.save(transactionEntity);

        // Then
        assertThat(savedTransaction.getTransactionId()).isNotNull();
        assertThat(savedTransaction.getTransactionType()).isEqualTo("Deposito");
        assertThat(savedTransaction.getAmount()).isEqualTo(BigDecimal.valueOf(575.00));
        assertThat(savedTransaction.getBalance()).isEqualTo(BigDecimal.valueOf(1575.00));
        assertThat(savedTransaction.getTransactionDate()).isNotNull();

        // Verify it was persisted
        AccountTransactionEntity foundTransaction = entityManager.find(AccountTransactionEntity.class, savedTransaction.getTransactionId());
        assertThat(foundTransaction).isNotNull();
        assertThat(foundTransaction.getTransactionType()).isEqualTo("Deposito");
    }

    @Test
    void findAll_ShouldReturnAllTransactions() {
        // Given
        AccountEntity persistedAccount = entityManager.persistAndFlush(accountEntity);
        transactionEntity.setAccount(persistedAccount);
        entityManager.persistAndFlush(transactionEntity);

        AccountTransactionEntity secondTransaction = new AccountTransactionEntity();
        secondTransaction.setTransactionType("Retiro");
        secondTransaction.setAmount(BigDecimal.valueOf(100.00));
        secondTransaction.setBalance(BigDecimal.valueOf(1475.00));
        secondTransaction.setTransactionDate(LocalDateTime.now());
        secondTransaction.setAccount(persistedAccount);
        entityManager.persistAndFlush(secondTransaction);

        // When
        List<AccountTransactionEntity> transactions = transactionRepository.findAll();

        // Then
        assertThat(transactions).hasSize(2);
        assertThat(transactions.get(0).getTransactionType()).isEqualTo("Deposito");
        assertThat(transactions.get(1).getTransactionType()).isEqualTo("Retiro");
    }

    @Test
    void findById_ShouldReturnTransaction_WhenExists() {
        // Given
        AccountEntity persistedAccount = entityManager.persistAndFlush(accountEntity);
        transactionEntity.setAccount(persistedAccount);
        AccountTransactionEntity persistedTransaction = entityManager.persistAndFlush(transactionEntity);

        // When
        Optional<AccountTransactionEntity> result = transactionRepository.findById(persistedTransaction.getTransactionId());

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getTransactionId()).isEqualTo(persistedTransaction.getTransactionId());
        assertThat(result.get().getTransactionType()).isEqualTo("Deposito");
        assertThat(result.get().getAmount()).isEqualTo(BigDecimal.valueOf(575.00));
    }

    @Test
    void findById_ShouldReturnEmpty_WhenTransactionDoesNotExist() {
        // When
        Optional<AccountTransactionEntity> result = transactionRepository.findById(999L);

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void deleteById_ShouldRemoveTransaction() {
        // Given
        AccountEntity persistedAccount = entityManager.persistAndFlush(accountEntity);
        transactionEntity.setAccount(persistedAccount);
        AccountTransactionEntity persistedTransaction = entityManager.persistAndFlush(transactionEntity);
        Long transactionId = persistedTransaction.getTransactionId();

        // When
        transactionRepository.deleteById(transactionId);
        entityManager.flush();

        // Then
        AccountTransactionEntity deletedTransaction = entityManager.find(AccountTransactionEntity.class, transactionId);
        assertThat(deletedTransaction).isNull();
    }
}