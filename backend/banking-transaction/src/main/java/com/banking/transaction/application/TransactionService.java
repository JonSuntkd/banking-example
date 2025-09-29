package com.banking.transaction.application;

import com.banking.transaction.application.dto.TransactionRequest;
import com.banking.transaction.application.dto.TransactionResponse;
import com.banking.transaction.application.dto.TransactionReportDTO;
import com.banking.transaction.application.dto.TransactionListResponse;
import com.banking.transaction.application.dto.AccountStatementReportResponse;
import java.time.LocalDate;
import java.util.List;

public interface TransactionService {
    TransactionResponse createTransaction(TransactionRequest request);
    List<TransactionListResponse> getAllTransactions();
    List<TransactionReportDTO> getTransactionReport(String date);
    AccountStatementReportResponse getAccountStatementReport(LocalDate startDate, LocalDate endDate, String clientName);
    TransactionResponse updateTransaction(Long id, TransactionRequest request);
    void deleteTransaction(Long id);
}
