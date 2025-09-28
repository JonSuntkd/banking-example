package com.banking.account.infrastructure.dto;

import java.math.BigDecimal;

public class AccountListResponse {
    private String accountNumber;
    private String accountType;
    private BigDecimal initialBalance;
    private Boolean status;
    private String clientName;

    // Constructor vacío
    public AccountListResponse() {}

    // Constructor completo
    public AccountListResponse(String accountNumber, String accountType, BigDecimal initialBalance, 
                              Boolean status, String clientName) {
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.initialBalance = initialBalance;
        this.status = status;
        this.clientName = clientName;
    }

    // Getters y Setters
    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public BigDecimal getInitialBalance() {
        return initialBalance;
    }

    public void setInitialBalance(BigDecimal initialBalance) {
        this.initialBalance = initialBalance;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }
}