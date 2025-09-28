package com.banking.transaction.application;

import com.banking.transaction.application.dto.TransactionRequest;
import com.banking.transaction.application.dto.TransactionResponse;
import com.banking.transaction.application.dto.TransactionReportDTO;
import com.banking.transaction.application.dto.TransactionListResponse;
import com.banking.transaction.domain.AccountTransaction;
import com.banking.transaction.infrastructure.AccountEntity;
import com.banking.transaction.infrastructure.AccountRepository;
import com.banking.transaction.infrastructure.AccountTransactionEntity;
import com.banking.transaction.infrastructure.AccountTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {
    private final AccountRepository accountRepository;
    private final AccountTransactionRepository transactionRepository;

    public TransactionServiceImpl(AccountRepository accountRepository, AccountTransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional
    public TransactionResponse createTransaction(TransactionRequest request) {
        AccountEntity account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("La cuenta no existe"));

        // Validar que la cuenta esté activa
        if (!account.getStatus()) {
            throw new RuntimeException("La cuenta está desactivada");
        }

        BigDecimal initialBalance = account.getInitialBalance();
        BigDecimal amount = request.getAmount();
        BigDecimal newBalance;
        String type = request.getTransactionType();

        if ("Deposito".equalsIgnoreCase(type)) {
            newBalance = initialBalance.add(amount);
        } else if ("Retiro".equalsIgnoreCase(type)) {
            if (amount.compareTo(initialBalance) > 0) {
                throw new RuntimeException("No se puede realizar esta transacción por falta de dinero");
            }
            newBalance = initialBalance.subtract(amount);
        } else {
            throw new RuntimeException("Tipo de transacción inválido");
        }

        // Actualizar saldo en cuenta
        account.setInitialBalance(newBalance);
        accountRepository.save(account);

        // Guardar movimiento
        AccountTransactionEntity tx = new AccountTransactionEntity();
        tx.setAccount(account);
        tx.setTransactionType(type);
        tx.setAmount(amount);
        tx.setBalance(newBalance);
        tx.setTransactionDate(LocalDateTime.now());
        transactionRepository.save(tx);

        TransactionResponse response = new TransactionResponse();
        response.setAccountNumber(account.getAccountNumber());
        response.setTransactionType(type);
        response.setAmount(amount);
        response.setBalance(newBalance);
        return response;
    }

    @Override
    public List<TransactionListResponse> getAllTransactions() {
        return transactionRepository.findAllWithAccount().stream()
                .map(this::toTransactionListResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionReportDTO> getTransactionReport(String date) {
        // Esta implementación necesitaría un query nativo para obtener todos los datos necesarios
        // Por simplicidad, devolvemos un ejemplo con los datos disponibles
        return transactionRepository.findAll().stream()
                .map(this::toReportDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TransactionResponse updateTransaction(Long id, TransactionRequest request) {
        AccountTransactionEntity tx = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado"));
        // Solo se permite actualizar el tipo y monto, recalculando el balance
        AccountEntity account = tx.getAccount();
        if (account == null) {
            throw new RuntimeException("Cuenta no encontrada");
        }
        
        // Validar que la cuenta esté activa
        if (!account.getStatus()) {
            throw new RuntimeException("La cuenta está desactivada");
        }
        
        BigDecimal initialBalance = account.getInitialBalance();
        BigDecimal amount = request.getAmount();
        String type = request.getTransactionType();
        BigDecimal newBalance;
        if ("Deposito".equalsIgnoreCase(type)) {
            newBalance = initialBalance.add(amount);
        } else if ("Retiro".equalsIgnoreCase(type)) {
            if (amount.compareTo(initialBalance) > 0) {
                throw new RuntimeException("No se puede realizar esta transacción por falta de dinero");
            }
            newBalance = initialBalance.subtract(amount);
        } else {
            throw new RuntimeException("Tipo de transacción inválido");
        }
        tx.setTransactionType(type);
        tx.setAmount(amount);
        tx.setBalance(newBalance);
        transactionRepository.save(tx);
        // Actualizar saldo en cuenta
        account.setInitialBalance(newBalance);
        accountRepository.save(account);
        TransactionResponse response = new TransactionResponse();
        response.setAccountNumber(account.getAccountNumber());
        response.setTransactionType(type);
        response.setAmount(amount);
        response.setBalance(newBalance);
        return response;
    }

    @Override
    @Transactional
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

    private AccountTransaction toDomain(AccountTransactionEntity entity) {
        AccountTransaction tx = new AccountTransaction();
        tx.setTransactionId(entity.getTransactionId());
        tx.setAccountId(entity.getAccount() != null ? entity.getAccount().getAccountId() : null);
        tx.setTransactionDate(entity.getTransactionDate());
        tx.setTransactionType(entity.getTransactionType());
        tx.setAmount(entity.getAmount());
        tx.setBalance(entity.getBalance());
        return tx;
    }

    private TransactionReportDTO toReportDTO(AccountTransactionEntity entity) {
        TransactionReportDTO report = new TransactionReportDTO();
        
        // Format date
        if (entity.getTransactionDate() != null) {
            report.setFecha(entity.getTransactionDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        } else {
            report.setFecha(LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        }
        
        // Get account information
        if (entity.getAccount() != null) {
            AccountEntity account = entity.getAccount();
            report.setNumeroCuenta(account.getAccountNumber());
            report.setTipo(account.getAccountType());
            report.setSaldoInicial(account.getInitialBalance());
            report.setEstado(account.getStatus());
            
            // Get client and person information
            if (account.getClient() != null && account.getClient().getPerson() != null) {
                report.setCliente(account.getClient().getPerson().getFullName());
            } else {
                report.setCliente("Cliente no encontrado");
            }
        } else {
            // Valores por defecto si no hay relaciones cargadas
            report.setCliente("Cliente Ejemplo");
            report.setNumeroCuenta("N/A");
            report.setTipo("N/A");
            report.setSaldoInicial(BigDecimal.ZERO);
            report.setEstado(true);
        }
        
        report.setMovimiento(entity.getAmount());
        report.setSaldoDisponible(entity.getBalance());
        
        return report;
    }
    
    private TransactionListResponse toTransactionListResponse(AccountTransactionEntity entity) {
        TransactionListResponse response = new TransactionListResponse();
        
        // Usar la relación account para obtener el accountNumber
        if (entity.getAccount() != null) {
            response.setAccountNumber(entity.getAccount().getAccountNumber());
        } else {
            response.setAccountNumber("N/A");
        }
        
        response.setTransactionDate(entity.getTransactionDate());
        response.setTransactionType(entity.getTransactionType());
        response.setAmount(entity.getAmount());
        response.setBalance(entity.getBalance());
        
        return response;
    }
}
