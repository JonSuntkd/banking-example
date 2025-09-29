package com.banking.transaction.adapters;

import com.banking.transaction.application.TransactionService;
import com.banking.transaction.application.dto.TransactionRequest;
import com.banking.transaction.application.dto.TransactionResponse;
import com.banking.transaction.application.dto.TransactionReportDTO;
import com.banking.transaction.application.dto.TransactionListResponse;
import com.banking.transaction.application.dto.AccountStatementReportResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/transaction")
public class TransactionController {
    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> create(@RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.createTransaction(request));
    }

    @GetMapping
    public ResponseEntity<List<TransactionListResponse>> getAll() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/report")
    public ResponseEntity<List<TransactionReportDTO>> getReport(@RequestParam String date) {
        if (date == null || date.trim().isEmpty()) {
            throw new RuntimeException("El parámetro 'date' es requerido");
        }
        return ResponseEntity.ok(transactionService.getTransactionReport(date));
    }

    @GetMapping("/reports-report")
    public ResponseEntity<AccountStatementReportResponse> getAccountStatementReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam String clientName) {
        
        if (startDate == null || endDate == null) {
            throw new RuntimeException("Los parámetros 'startDate' y 'endDate' son requeridos");
        }
        
        if (clientName == null || clientName.trim().isEmpty()) {
            throw new RuntimeException("El parámetro 'clientName' es requerido");
        }
        
        if (startDate.isAfter(endDate)) {
            throw new RuntimeException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }
        
        return ResponseEntity.ok(transactionService.getAccountStatementReport(startDate, endDate, clientName.trim()));
    }

    @GetMapping("/reports-report/preview")
    public ResponseEntity<String> getAccountStatementReportPreview(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam String clientName) {
        
        if (startDate == null || endDate == null) {
            throw new RuntimeException("Los parámetros 'startDate' y 'endDate' son requeridos");
        }
        
        if (clientName == null || clientName.trim().isEmpty()) {
            throw new RuntimeException("El parámetro 'clientName' es requerido");
        }
        
        if (startDate.isAfter(endDate)) {
            throw new RuntimeException("La fecha de inicio no puede ser posterior a la fecha de fin");
        }
        
        AccountStatementReportResponse response = transactionService.getAccountStatementReport(startDate, endDate, clientName.trim());
        
        // Decodificar el PDF base64 para mostrar el contenido
        byte[] decodedBytes = java.util.Base64.getDecoder().decode(response.getPdfBase64());
        String decodedContent = new String(decodedBytes);
        
        return ResponseEntity.ok(decodedContent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponse> update(@PathVariable Long id, @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(transactionService.updateTransaction(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}
