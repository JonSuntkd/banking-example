package com.banking.transaction.application;

import com.banking.transaction.application.dto.TransactionRequest;
import com.banking.transaction.infrastructure.AccountEntity;
import com.banking.transaction.infrastructure.AccountRepository;
import com.banking.transaction.infrastructure.AccountTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceAccountStatusTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AccountTransactionRepository transactionRepository;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    private AccountEntity activeAccount;
    private AccountEntity inactiveAccount;

    @BeforeEach
    void setUp() {
        // Cuenta activa
        activeAccount = new AccountEntity();
        activeAccount.setAccountId(1L);
        activeAccount.setAccountNumber("225487");
        activeAccount.setAccountType("Corriente");
        activeAccount.setInitialBalance(BigDecimal.valueOf(1000.00));
        activeAccount.setStatus(true); // Cuenta ACTIVA

        // Cuenta inactiva
        inactiveAccount = new AccountEntity();
        inactiveAccount.setAccountId(2L);
        inactiveAccount.setAccountNumber("INACTIVE_ACCOUNT");
        inactiveAccount.setAccountType("Corriente");
        inactiveAccount.setInitialBalance(BigDecimal.valueOf(500.00));
        inactiveAccount.setStatus(false); // Cuenta INACTIVA
    }

    @Test
    void createTransactionShouldSucceedWhenAccountIsActive() {
        // Given
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("225487");
        request.setTransactionType("Deposito");
        request.setAmount(BigDecimal.valueOf(100.00));

        when(accountRepository.findByAccountNumber("225487")).thenReturn(Optional.of(activeAccount));
        when(accountRepository.save(any(AccountEntity.class))).thenReturn(activeAccount);
        when(transactionRepository.save(any())).thenReturn(null);

        // When & Then
        assertDoesNotThrow(() -> transactionService.createTransaction(request));
        verify(accountRepository, times(1)).findByAccountNumber("225487");
        verify(accountRepository, times(1)).save(any(AccountEntity.class));
    }

    @Test
    void createTransactionShouldFailWhenAccountIsInactive() {
        // Given
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("INACTIVE_ACCOUNT");
        request.setTransactionType("Deposito");
        request.setAmount(BigDecimal.valueOf(100.00));

        when(accountRepository.findByAccountNumber("INACTIVE_ACCOUNT")).thenReturn(Optional.of(inactiveAccount));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> transactionService.createTransaction(request));
        
        assertEquals("La cuenta está desactivada", exception.getMessage());
        verify(accountRepository, times(1)).findByAccountNumber("INACTIVE_ACCOUNT");
        verify(accountRepository, never()).save(any(AccountEntity.class));
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void createTransactionShouldFailWhenAccountNotExists() {
        // Given
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("NON_EXISTENT");
        request.setTransactionType("Deposito");
        request.setAmount(BigDecimal.valueOf(100.00));

        when(accountRepository.findByAccountNumber("NON_EXISTENT")).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> transactionService.createTransaction(request));
        
        assertEquals("La cuenta no existe", exception.getMessage());
        verify(accountRepository, times(1)).findByAccountNumber("NON_EXISTENT");
        verify(accountRepository, never()).save(any(AccountEntity.class));
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void createTransactionShouldFailWhenInsufficientFundsForWithdrawal() {
        // Given
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("225487");
        request.setTransactionType("Retiro");
        request.setAmount(BigDecimal.valueOf(2000.00)); // Más que el saldo actual

        when(accountRepository.findByAccountNumber("225487")).thenReturn(Optional.of(activeAccount));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> transactionService.createTransaction(request));
        
        assertEquals("No se puede realizar esta transacción por falta de dinero", exception.getMessage());
        verify(accountRepository, times(1)).findByAccountNumber("225487");
        verify(accountRepository, never()).save(any(AccountEntity.class));
        verify(transactionRepository, never()).save(any());
    }
}