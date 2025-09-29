package com.banking.transaction.application;

import com.banking.transaction.application.dto.TransactionRequest;
import com.banking.transaction.application.dto.TransactionResponse;
import com.banking.transaction.application.dto.TransactionReportDTO;
import com.banking.transaction.application.dto.TransactionListResponse;
import java.util.List;

public interface TransactionService {
    TransactionResponse createTransaction(TransactionRequest request);
    List<TransactionListResponse> getAllTransactions();
    List<TransactionReportDTO> getTransactionReport(String date);
    TransactionResponse updateTransaction(Long id, TransactionRequest request);
    void deleteTransaction(Long id);
}
