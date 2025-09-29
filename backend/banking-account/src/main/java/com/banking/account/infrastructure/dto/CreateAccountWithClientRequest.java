package com.banking.account.infrastructure.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class CreateAccountWithClientRequest {
    @NotBlank(message = "Account number is required")
    @Size(max = 20, message = "Account number must not exceed 20 characters")
    private String accountNumber;

    @NotBlank(message = "Account type is required")
    @Pattern(regexp = "^(Ahorro|Corriente|Credito)$", message = "Account type must be: Ahorro, Corriente, or Credito")
    private String accountType;

    @NotNull(message = "Initial balance is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Initial balance must be greater than or equal to 0")
    private BigDecimal initialBalance;

    @NotNull(message = "Status is required")
    private Boolean status;

    @NotBlank(message = "Client name is required")
    @Size(max = 100, message = "Client name must not exceed 100 characters")
    private String clientName;

    // Constructors
    public CreateAccountWithClientRequest() {}

    public CreateAccountWithClientRequest(String accountNumber, String accountType, BigDecimal initialBalance, Boolean status, String clientName) {
        this.accountNumber = accountNumber;
        this.accountType = accountType;
        this.initialBalance = initialBalance;
        this.status = status;
        this.clientName = clientName;
    }

    // Getters and Setters
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