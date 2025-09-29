package com.banking.transaction.infrastructure;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class AccountRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private AccountRepository accountRepository;

    private AccountEntity accountEntity;

    @BeforeEach
    void setUp() {
        accountEntity = new AccountEntity();
        accountEntity.setAccountNumber("225487");
        accountEntity.setAccountType("Corriente");
        accountEntity.setInitialBalance(BigDecimal.valueOf(1000.00));
        accountEntity.setStatus(true);
    }

    @Test
    void findByAccountNumber_ShouldReturnAccount_WhenAccountExists() {
        // Given
        entityManager.persistAndFlush(accountEntity);

        // When
        Optional<AccountEntity> result = accountRepository.findByAccountNumber("225487");

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getAccountNumber()).isEqualTo("225487");
        assertThat(result.get().getAccountType()).isEqualTo("Corriente");
        assertThat(result.get().getInitialBalance()).isEqualTo(BigDecimal.valueOf(1000.00));
        assertThat(result.get().getStatus()).isTrue();
    }

    @Test
    void findByAccountNumber_ShouldReturnEmpty_WhenAccountDoesNotExist() {
        // When
        Optional<AccountEntity> result = accountRepository.findByAccountNumber("999999");

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void save_ShouldPersistAccount() {
        // When
        AccountEntity savedAccount = accountRepository.save(accountEntity);

        // Then
        assertThat(savedAccount.getAccountId()).isNotNull();
        assertThat(savedAccount.getAccountNumber()).isEqualTo("225487");
        assertThat(savedAccount.getAccountType()).isEqualTo("Corriente");
        assertThat(savedAccount.getInitialBalance()).isEqualTo(BigDecimal.valueOf(1000.00));

        // Verify it was persisted
        AccountEntity foundAccount = entityManager.find(AccountEntity.class, savedAccount.getAccountId());
        assertThat(foundAccount).isNotNull();
        assertThat(foundAccount.getAccountNumber()).isEqualTo("225487");
    }

    @Test
    void findById_ShouldReturnAccount_WhenExists() {
        // Given
        AccountEntity persistedAccount = entityManager.persistAndFlush(accountEntity);

        // When
        Optional<AccountEntity> result = accountRepository.findById(persistedAccount.getAccountId());

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getAccountId()).isEqualTo(persistedAccount.getAccountId());
        assertThat(result.get().getAccountNumber()).isEqualTo("225487");
    }

    @Test
    void deleteById_ShouldRemoveAccount() {
        // Given
        AccountEntity persistedAccount = entityManager.persistAndFlush(accountEntity);
        Long accountId = persistedAccount.getAccountId();

        // When
        accountRepository.deleteById(accountId);
        entityManager.flush();

        // Then
        AccountEntity deletedAccount = entityManager.find(AccountEntity.class, accountId);
        assertThat(deletedAccount).isNull();
    }
}