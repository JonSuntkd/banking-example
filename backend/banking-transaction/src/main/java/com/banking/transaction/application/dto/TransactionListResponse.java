package com.banking.transaction.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionListResponse {
    private String accountNumber;
    private LocalDateTime transactionDate;
    private String transactionType;
    private BigDecimal amount;
    private BigDecimal balance;

    // Getters and setters
    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
}