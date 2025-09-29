package com.banking.transaction.application.dto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class TransactionRequestTest {

    private TransactionRequest transactionRequest;

    @BeforeEach
    void setUp() {
        transactionRequest = new TransactionRequest();
    }

    @Test
    void setAndGetAccountNumber_ShouldWorkCorrectly() {
        // Given
        String accountNumber = "225487";

        // When
        transactionRequest.setAccountNumber(accountNumber);

        // Then
        assertThat(transactionRequest.getAccountNumber()).isEqualTo(accountNumber);
    }

    @Test
    void setAndGetTransactionType_ShouldWorkCorrectly() {
        // Given
        String transactionType = "Deposito";

        // When
        transactionRequest.setTransactionType(transactionType);

        // Then
        assertThat(transactionRequest.getTransactionType()).isEqualTo(transactionType);
    }

    @Test
    void setAndGetAmount_ShouldWorkCorrectly() {
        // Given
        BigDecimal amount = BigDecimal.valueOf(575.00);

        // When
        transactionRequest.setAmount(amount);

        // Then
        assertThat(transactionRequest.getAmount()).isEqualTo(amount);
    }

    @Test
    void transactionRequest_ShouldInitializeWithNullValues() {
        // Given & When
        TransactionRequest newRequest = new TransactionRequest();

        // Then
        assertThat(newRequest.getAccountNumber()).isNull();
        assertThat(newRequest.getTransactionType()).isNull();
        assertThat(newRequest.getAmount()).isNull();
    }

    @Test
    void transactionRequest_ShouldHandleAllFields() {
        // Given
        String accountNumber = "225487";
        String transactionType = "Retiro";
        BigDecimal amount = BigDecimal.valueOf(100.00);

        // When
        transactionRequest.setAccountNumber(accountNumber);
        transactionRequest.setTransactionType(transactionType);
        transactionRequest.setAmount(amount);

        // Then
        assertThat(transactionRequest.getAccountNumber()).isEqualTo(accountNumber);
        assertThat(transactionRequest.getTransactionType()).isEqualTo(transactionType);
        assertThat(transactionRequest.getAmount()).isEqualTo(amount);
    }
}