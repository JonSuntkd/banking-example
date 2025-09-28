package com.banking.transaction.application.dto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class TransactionResponseTest {

    private TransactionResponse transactionResponse;

    @BeforeEach
    void setUp() {
        transactionResponse = new TransactionResponse();
    }

    @Test
    void setAndGetAllFields_ShouldWorkCorrectly() {
        // Given
        String accountNumber = "225487";
        String transactionType = "Deposito";
        BigDecimal amount = BigDecimal.valueOf(575.00);
        BigDecimal balance = BigDecimal.valueOf(1575.00);

        // When
        transactionResponse.setAccountNumber(accountNumber);
        transactionResponse.setTransactionType(transactionType);
        transactionResponse.setAmount(amount);
        transactionResponse.setBalance(balance);

        // Then
        assertThat(transactionResponse.getAccountNumber()).isEqualTo(accountNumber);
        assertThat(transactionResponse.getTransactionType()).isEqualTo(transactionType);
        assertThat(transactionResponse.getAmount()).isEqualTo(amount);
        assertThat(transactionResponse.getBalance()).isEqualTo(balance);
    }

    @Test
    void transactionResponse_ShouldInitializeWithNullValues() {
        // Given & When
        TransactionResponse newResponse = new TransactionResponse();

        // Then
        assertThat(newResponse.getAccountNumber()).isNull();
        assertThat(newResponse.getTransactionType()).isNull();
        assertThat(newResponse.getAmount()).isNull();
        assertThat(newResponse.getBalance()).isNull();
    }

    @Test
    void transactionResponse_ShouldHandleRetiroTransaction() {
        // Given
        String accountNumber = "225487";
        String transactionType = "Retiro";
        BigDecimal amount = BigDecimal.valueOf(100.00);
        BigDecimal balance = BigDecimal.valueOf(900.00);

        // When
        transactionResponse.setAccountNumber(accountNumber);
        transactionResponse.setTransactionType(transactionType);
        transactionResponse.setAmount(amount);
        transactionResponse.setBalance(balance);

        // Then
        assertThat(transactionResponse.getAccountNumber()).isEqualTo(accountNumber);
        assertThat(transactionResponse.getTransactionType()).isEqualTo(transactionType);
        assertThat(transactionResponse.getAmount()).isEqualTo(amount);
        assertThat(transactionResponse.getBalance()).isEqualTo(balance);
    }
}