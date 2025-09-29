package com.banking.transaction.application;

import com.banking.transaction.application.dto.TransactionRequest;
import com.banking.transaction.application.dto.TransactionResponse;
import com.banking.transaction.application.dto.TransactionReportDTO;
import com.banking.transaction.application.dto.TransactionListResponse;
import com.banking.transaction.application.dto.AccountStatementDTO;
import com.banking.transaction.application.dto.AccountStatementReportResponse;
import com.banking.transaction.infrastructure.AccountEntity;
import com.banking.transaction.infrastructure.AccountRepository;
import com.banking.transaction.infrastructure.AccountTransactionEntity;
import com.banking.transaction.infrastructure.AccountTransactionRepository;
import com.banking.transaction.infrastructure.ClientEntity;
import com.banking.transaction.infrastructure.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.ArrayList;
import java.util.Base64;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {
    private final AccountRepository accountRepository;
    private final AccountTransactionRepository transactionRepository;
    private final ClientRepository clientRepository;

    public TransactionServiceImpl(AccountRepository accountRepository, AccountTransactionRepository transactionRepository, ClientRepository clientRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
        this.clientRepository = clientRepository;
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
        // Parse the date from dd/MM/yyyy format to LocalDate
        LocalDate transactionDate;
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            transactionDate = LocalDate.parse(date, formatter);
        } catch (Exception e) {
            throw new RuntimeException("Formato de fecha inválido. Use dd/MM/yyyy");
        }
        
        // Find transactions for the specific date
        List<AccountTransactionEntity> transactions = transactionRepository.findByTransactionDate(transactionDate);
        
        // Check if any transactions exist for this date
        if (transactions.isEmpty()) {
            throw new RuntimeException("No existen movimientos en la fecha " + date);
        }
        
        return transactions.stream()
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

    @Override
    @Transactional(readOnly = true)
    public AccountStatementReportResponse getAccountStatementReport(LocalDate startDate, LocalDate endDate, String clientName) {
        // Buscar el cliente por nombre
        ClientEntity client = clientRepository.findByClientName(clientName)
                .orElseThrow(() -> new RuntimeException("No existe cliente con el nombre: " + clientName));

        // Obtener todas las cuentas del cliente
        List<AccountEntity> clientAccounts = accountRepository.findByClientId(client.getClientId());

        if (clientAccounts.isEmpty()) {
            throw new RuntimeException("El cliente " + clientName + " no tiene cuentas asociadas");
        }

        List<AccountStatementDTO> reportItems = new ArrayList<>();
        boolean hasMovements = false;

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

        for (AccountEntity account : clientAccounts) {
            // Obtener transacciones en el rango de fechas para esta cuenta
            List<AccountTransactionEntity> transactions = transactionRepository
                    .findByAccountIdAndDateRange(account.getAccountId(), startDate, endDate);

            if (!transactions.isEmpty()) {
                hasMovements = true;
                
                // Crear un registro por cada transacción
                for (AccountTransactionEntity transaction : transactions) {
                    AccountStatementDTO reportItem = new AccountStatementDTO();
                    reportItem.setFecha(transaction.getTransactionDate().toLocalDate().format(dateFormatter));
                    reportItem.setCliente(client.getPerson().getFullName());
                    reportItem.setNumeroCuenta(account.getAccountNumber());
                    reportItem.setTipo(account.getAccountType());
                    reportItem.setSaldoInicial(account.getInitialBalance());
                    reportItem.setEstado(account.getStatus());
                    reportItem.setMovimiento(transaction.getAmount());
                    reportItem.setSaldoDisponible(transaction.getBalance());

                    reportItems.add(reportItem);
                }
            }
        }

        // Validar si hay movimientos en las fechas especificadas
        if (!hasMovements) {
            throw new RuntimeException("No existen movimientos para el cliente " + clientName + 
                                     " en el rango de fechas especificado (" + 
                                     startDate.format(dateFormatter) + " - " + endDate.format(dateFormatter) + ")");
        }

        // Generar PDF en base64 (simulado por ahora)
        String pdfBase64 = generatePdfReport(reportItems);

        return new AccountStatementReportResponse(reportItems, pdfBase64);
    }

    private String generatePdfReport(List<AccountStatementDTO> reportItems) {
        // Simulación básica de generación de PDF
        // En una implementación real, aquí usaríamos iText, Apache PDFBox, o similar
        StringBuilder pdfContent = new StringBuilder();
        pdfContent.append("REPORTE DE ESTADO DE CUENTA\\n\\n");
        
        for (AccountStatementDTO item : reportItems) {
            pdfContent.append("Cliente: ").append(item.getCliente()).append("\\n");
            pdfContent.append("Fecha: ").append(item.getFecha()).append("\\n");
            pdfContent.append("Número Cuenta: ").append(item.getNumeroCuenta()).append("\\n");
            pdfContent.append("Tipo: ").append(item.getTipo()).append("\\n");
            pdfContent.append("Saldo Inicial: ").append(item.getSaldoInicial()).append("\\n");
            pdfContent.append("Estado: ").append(item.getEstado()).append("\\n");
            pdfContent.append("Movimiento: ").append(item.getMovimiento()).append("\\n");
            pdfContent.append("Saldo Disponible: ").append(item.getSaldoDisponible()).append("\\n");
            pdfContent.append("\\n----------------------------\\n\\n");
        }
        
        // Convertir a Base64 (simulado)
        return Base64.getEncoder().encodeToString(pdfContent.toString().getBytes());
    }
}
