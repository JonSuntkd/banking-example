package com.banking.transaction.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class AccountTransactionTest {

    private AccountTransaction accountTransaction;

    @BeforeEach
    void setUp() {
        accountTransaction = new AccountTransaction();
    }

    @Test
    void setAndGetTransactionId_ShouldWorkCorrectly() {
        // Given
        Long transactionId = 1L;

        // When
        accountTransaction.setTransactionId(transactionId);

        // Then
        assertThat(accountTransaction.getTransactionId()).isEqualTo(transactionId);
    }

    @Test
    void setAndGetAccountId_ShouldWorkCorrectly() {
        // Given
        Long accountId = 1L;

        // When
        accountTransaction.setAccountId(accountId);

        // Then
        assertThat(accountTransaction.getAccountId()).isEqualTo(accountId);
    }

    @Test
    void setAndGetTransactionDate_ShouldWorkCorrectly() {
        // Given
        LocalDateTime transactionDate = LocalDateTime.now();

        // When
        accountTransaction.setTransactionDate(transactionDate);

        // Then
        assertThat(accountTransaction.getTransactionDate()).isEqualTo(transactionDate);
    }

    @Test
    void setAndGetTransactionType_ShouldWorkCorrectly() {
        // Given
        String transactionType = "Deposito";

        // When
        accountTransaction.setTransactionType(transactionType);

        // Then
        assertThat(accountTransaction.getTransactionType()).isEqualTo(transactionType);
    }

    @Test
    void setAndGetAmount_ShouldWorkCorrectly() {
        // Given
        BigDecimal amount = BigDecimal.valueOf(575.00);

        // When
        accountTransaction.setAmount(amount);

        // Then
        assertThat(accountTransaction.getAmount()).isEqualTo(amount);
    }

    @Test
    void setAndGetBalance_ShouldWorkCorrectly() {
        // Given
        BigDecimal balance = BigDecimal.valueOf(1575.00);

        // When
        accountTransaction.setBalance(balance);

        // Then
        assertThat(accountTransaction.getBalance()).isEqualTo(balance);
    }

    @Test
    void accountTransaction_ShouldInitializeWithNullValues() {
        // Given & When
        AccountTransaction newTransaction = new AccountTransaction();

        // Then
        assertThat(newTransaction.getTransactionId()).isNull();
        assertThat(newTransaction.getAccountId()).isNull();
        assertThat(newTransaction.getTransactionDate()).isNull();
        assertThat(newTransaction.getTransactionType()).isNull();
        assertThat(newTransaction.getAmount()).isNull();
        assertThat(newTransaction.getBalance()).isNull();
    }

    @Test
    void accountTransaction_ShouldHandleCompleteTransaction() {
        // Given
        Long transactionId = 1L;
        Long accountId = 1L;
        LocalDateTime transactionDate = LocalDateTime.now();
        String transactionType = "Retiro";
        BigDecimal amount = BigDecimal.valueOf(100.00);
        BigDecimal balance = BigDecimal.valueOf(900.00);

        // When
        accountTransaction.setTransactionId(transactionId);
        accountTransaction.setAccountId(accountId);
        accountTransaction.setTransactionDate(transactionDate);
        accountTransaction.setTransactionType(transactionType);
        accountTransaction.setAmount(amount);
        accountTransaction.setBalance(balance);

        // Then
        assertThat(accountTransaction.getTransactionId()).isEqualTo(transactionId);
        assertThat(accountTransaction.getAccountId()).isEqualTo(accountId);
        assertThat(accountTransaction.getTransactionDate()).isEqualTo(transactionDate);
        assertThat(accountTransaction.getTransactionType()).isEqualTo(transactionType);
        assertThat(accountTransaction.getAmount()).isEqualTo(amount);
        assertThat(accountTransaction.getBalance()).isEqualTo(balance);
    }
}