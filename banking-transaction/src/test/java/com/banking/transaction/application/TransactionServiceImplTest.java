package com.banking.transaction.application;

import com.banking.transaction.application.dto.TransactionRequest;
import com.banking.transaction.application.dto.TransactionResponse;
import com.banking.transaction.application.dto.TransactionReportDTO;
import com.banking.transaction.application.dto.TransactionListResponse;
import com.banking.transaction.infrastructure.AccountEntity;
import com.banking.transaction.infrastructure.AccountRepository;
import com.banking.transaction.infrastructure.AccountTransactionEntity;
import com.banking.transaction.infrastructure.AccountTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceImplTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private AccountTransactionRepository transactionRepository;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    private AccountEntity accountEntity;
    private AccountTransactionEntity transactionEntity;
    private TransactionRequest transactionRequest;

    @BeforeEach
    void setUp() {
        accountEntity = new AccountEntity();
        accountEntity.setAccountId(1L);
        accountEntity.setAccountNumber("225487");
        accountEntity.setAccountType("Corriente");
        accountEntity.setInitialBalance(BigDecimal.valueOf(1000.00));
        accountEntity.setStatus(true);

        transactionEntity = new AccountTransactionEntity();
        transactionEntity.setTransactionId(1L);
        transactionEntity.setTransactionType("Deposito");
        transactionEntity.setAmount(BigDecimal.valueOf(575.00));
        transactionEntity.setBalance(BigDecimal.valueOf(1575.00));
        transactionEntity.setTransactionDate(LocalDateTime.now());
        transactionEntity.setAccount(accountEntity);

        transactionRequest = new TransactionRequest();
        transactionRequest.setAccountNumber("225487");
        transactionRequest.setTransactionType("Deposito");
        transactionRequest.setAmount(BigDecimal.valueOf(575.00));
    }

    @Test
    void createTransaction_ShouldCreateDeposit_WhenValidDepositRequest() {
        // Given
        when(accountRepository.findByAccountNumber("225487")).thenReturn(Optional.of(accountEntity));
        when(accountRepository.save(any(AccountEntity.class))).thenReturn(accountEntity);
        when(transactionRepository.save(any(AccountTransactionEntity.class))).thenReturn(transactionEntity);

        // When
        TransactionResponse response = transactionService.createTransaction(transactionRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAccountNumber()).isEqualTo("225487");
        assertThat(response.getTransactionType()).isEqualTo("Deposito");
        assertThat(response.getAmount()).isEqualTo(BigDecimal.valueOf(575.00));
        assertThat(response.getBalance()).isEqualTo(BigDecimal.valueOf(1575.00));

        verify(accountRepository, times(1)).findByAccountNumber("225487");
        verify(accountRepository, times(1)).save(any(AccountEntity.class));
        verify(transactionRepository, times(1)).save(any(AccountTransactionEntity.class));
    }

    @Test
    void createTransaction_ShouldCreateWithdrawal_WhenValidWithdrawalRequest() {
        // Given
        transactionRequest.setTransactionType("Retiro");
        transactionRequest.setAmount(BigDecimal.valueOf(100.00));

        when(accountRepository.findByAccountNumber("225487")).thenReturn(Optional.of(accountEntity));
        when(accountRepository.save(any(AccountEntity.class))).thenReturn(accountEntity);
        when(transactionRepository.save(any(AccountTransactionEntity.class))).thenReturn(transactionEntity);

        // When
        TransactionResponse response = transactionService.createTransaction(transactionRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getTransactionType()).isEqualTo("Retiro");
        assertThat(response.getAmount()).isEqualTo(BigDecimal.valueOf(100.00));

        verify(accountRepository, times(1)).findByAccountNumber("225487");
        verify(accountRepository, times(1)).save(any(AccountEntity.class));
        verify(transactionRepository, times(1)).save(any(AccountTransactionEntity.class));
    }

    @Test
    void createTransaction_ShouldThrowException_WhenAccountNotFound() {
        // Given
        when(accountRepository.findByAccountNumber("225487")).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> transactionService.createTransaction(transactionRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("La cuenta no existe");

        verify(accountRepository, times(1)).findByAccountNumber("225487");
        verify(accountRepository, never()).save(any(AccountEntity.class));
        verify(transactionRepository, never()).save(any(AccountTransactionEntity.class));
    }

    @Test
    void createTransaction_ShouldThrowException_WhenInsufficientFunds() {
        // Given
        transactionRequest.setTransactionType("Retiro");
        transactionRequest.setAmount(BigDecimal.valueOf(2000.00)); // Mayor al saldo

        when(accountRepository.findByAccountNumber("225487")).thenReturn(Optional.of(accountEntity));

        // When & Then
        assertThatThrownBy(() -> transactionService.createTransaction(transactionRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("No se puede realizar esta transacción por falta de dinero");

        verify(accountRepository, times(1)).findByAccountNumber("225487");
        verify(accountRepository, never()).save(any(AccountEntity.class));
        verify(transactionRepository, never()).save(any(AccountTransactionEntity.class));
    }

    @Test
    void createTransaction_ShouldThrowException_WhenInvalidTransactionType() {
        // Given
        transactionRequest.setTransactionType("InvalidType");

        when(accountRepository.findByAccountNumber("225487")).thenReturn(Optional.of(accountEntity));

        // When & Then
        assertThatThrownBy(() -> transactionService.createTransaction(transactionRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Tipo de transacción inválido");

        verify(accountRepository, times(1)).findByAccountNumber("225487");
        verify(accountRepository, never()).save(any(AccountEntity.class));
        verify(transactionRepository, never()).save(any(AccountTransactionEntity.class));
    }

    @Test
    void getAllTransactions_ShouldReturnTransactionList() {
        // Given
        List<AccountTransactionEntity> entities = Arrays.asList(transactionEntity);
        when(transactionRepository.findAllWithAccount()).thenReturn(entities);

        // When
        List<TransactionListResponse> result = transactionService.getAllTransactions();

        // Then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAccountNumber()).isEqualTo("225487");
        assertThat(result.get(0).getTransactionType()).isEqualTo("Deposito");
        assertThat(result.get(0).getAmount()).isEqualTo(BigDecimal.valueOf(575.00));

        verify(transactionRepository, times(1)).findAllWithAccount();
    }

    @Test
    void getTransactionReport_ShouldReturnReportList() {
        // Given
        List<AccountTransactionEntity> entities = Arrays.asList(transactionEntity);
        when(transactionRepository.findByTransactionDate(any())).thenReturn(entities);

        // When
        List<TransactionReportDTO> result = transactionService.getTransactionReport("28/09/2025");

        // Then
        assertThat(result).isNotNull();
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getMovimiento()).isEqualTo(BigDecimal.valueOf(575.00));

        verify(transactionRepository, times(1)).findByTransactionDate(any());
    }

    @Test
    void getTransactionReport_ShouldThrowException_WhenNoTransactionsFoundForDate() {
        // Given
        when(transactionRepository.findByTransactionDate(any())).thenReturn(Arrays.asList());

        // When & Then
        assertThatThrownBy(() -> transactionService.getTransactionReport("28/09/2025"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("No existen movimientos en la fecha 28/09/2025");

        verify(transactionRepository, times(1)).findByTransactionDate(any());
    }

    @Test
    void getTransactionReport_ShouldThrowException_WhenInvalidDateFormat() {
        // When & Then
        assertThatThrownBy(() -> transactionService.getTransactionReport("invalid-date"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Formato de fecha inválido. Use dd/MM/yyyy");

        verify(transactionRepository, never()).findByTransactionDate(any());
    }

    @Test
    void updateTransaction_ShouldUpdateTransaction_WhenValidRequest() {
        // Given
        Long transactionId = 1L;
        when(transactionRepository.findById(transactionId)).thenReturn(Optional.of(transactionEntity));
        when(transactionRepository.save(any(AccountTransactionEntity.class))).thenReturn(transactionEntity);
        when(accountRepository.save(any(AccountEntity.class))).thenReturn(accountEntity);

        // When
        TransactionResponse response = transactionService.updateTransaction(transactionId, transactionRequest);

        // Then
        assertThat(response).isNotNull();
        assertThat(response.getAccountNumber()).isEqualTo("225487");
        assertThat(response.getTransactionType()).isEqualTo("Deposito");

        verify(transactionRepository, times(1)).findById(transactionId);
        verify(transactionRepository, times(1)).save(any(AccountTransactionEntity.class));
        verify(accountRepository, times(1)).save(any(AccountEntity.class));
    }

    @Test
    void updateTransaction_ShouldThrowException_WhenTransactionNotFound() {
        // Given
        Long transactionId = 1L;
        when(transactionRepository.findById(transactionId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> transactionService.updateTransaction(transactionId, transactionRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Movimiento no encontrado");

        verify(transactionRepository, times(1)).findById(transactionId);
        verify(transactionRepository, never()).save(any(AccountTransactionEntity.class));
    }

    @Test
    void deleteTransaction_ShouldDeleteTransaction() {
        // Given
        Long transactionId = 1L;
        doNothing().when(transactionRepository).deleteById(transactionId);

        // When
        transactionService.deleteTransaction(transactionId);

        // Then
        verify(transactionRepository, times(1)).deleteById(transactionId);
    }
}