package com.banking.account.infrastructure.controller;

import com.banking.account.application.service.AccountService;
import com.banking.account.domain.model.Account;
import com.banking.account.infrastructure.dto.CreateAccountWithClientRequest;
import com.banking.account.infrastructure.dto.AccountListResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/account")
public class AccountController {
    
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public ResponseEntity<List<AccountListResponse>> getAllAccounts() {
        List<AccountListResponse> accounts = accountService.getAllAccountsFormatted();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountListResponse> getAccountById(@PathVariable Long id) {
        AccountListResponse account = accountService.getAccountByIdFormatted(id);
        return ResponseEntity.ok(account);
    }

    @PostMapping("/with-client")
    public ResponseEntity<Account> createAccountWithClient(@Valid @RequestBody CreateAccountWithClientRequest request) {
        Account account = accountService.createAccountWithClient(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(account);
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(
            @RequestParam String clientName, 
            @Valid @RequestBody Account account) {
        Account createdAccount = accountService.createAccount(clientName, account);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAccount);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(
            @PathVariable Long id, 
            @Valid @RequestBody Account account) {
        Account updatedAccount = accountService.updateAccount(id, account);
        return ResponseEntity.ok(updatedAccount);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}