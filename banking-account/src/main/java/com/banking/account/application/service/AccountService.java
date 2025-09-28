package com.banking.account.application.service;

import com.banking.account.domain.exception.AccountNotFoundException;
import com.banking.account.domain.exception.ClientNotFoundException;
import com.banking.account.domain.exception.DuplicateAccountException;
import com.banking.account.domain.model.Account;
import com.banking.account.domain.model.Client;
import com.banking.account.domain.model.Person;
import com.banking.account.domain.repository.AccountRepository;
import com.banking.account.domain.repository.ClientRepository;
import com.banking.account.domain.repository.PersonRepository;
import com.banking.account.infrastructure.dto.CreateAccountWithClientRequest;
import com.banking.account.infrastructure.dto.AccountListResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountService {
    
    private final AccountRepository accountRepository;
    private final ClientRepository clientRepository;
    private final PersonRepository personRepository;

    public AccountService(AccountRepository accountRepository, 
                         ClientRepository clientRepository, 
                         PersonRepository personRepository) {
        this.accountRepository = accountRepository;
        this.clientRepository = clientRepository;
        this.personRepository = personRepository;
    }

    @Transactional(readOnly = true)
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<AccountListResponse> getAllAccountsFormatted() {
        List<Object[]> results = accountRepository.findAllAccountsWithClientNames();
        return results.stream()
                .map(row -> new AccountListResponse(
                        (String) row[0],  // account_number
                        (String) row[1],  // account_type
                        (BigDecimal) row[2],  // initial_balance
                        (Boolean) row[3],  // status
                        (String) row[4]   // full_name (clientName)
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AccountListResponse getAccountByIdFormatted(Long id) {
        List<Object[]> results = accountRepository.findAccountByIdWithClientName(id);
        if (results.isEmpty()) {
            throw new AccountNotFoundException("Cuenta no encontrada con ID: " + id);
        }
        Object[] row = results.get(0);
        return new AccountListResponse(
                (String) row[0],  // account_number
                (String) row[1],  // account_type
                (BigDecimal) row[2],  // initial_balance
                (Boolean) row[3],  // status
                (String) row[4]   // full_name (clientName)
        );
    }

    @Transactional(readOnly = true)
    public Account getAccountById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new AccountNotFoundException("Cuenta no encontrada con ID: " + id));
    }

    @Transactional
    public Account createAccountWithClient(CreateAccountWithClientRequest request) {
        // Validar que no existe cuenta duplicada
        if (accountRepository.existsByAccountNumber(request.getAccountNumber())) {
            throw new DuplicateAccountException("Cuenta ya existe con número: " + request.getAccountNumber());
        }

        // Buscar person por nombre completo
        Person person = personRepository.findByFullName(request.getClientName())
                .orElseThrow(() -> new ClientNotFoundException("No existe ese cliente: " + request.getClientName()));

        // Buscar client por person_id
        Client client = clientRepository.findByPerson_PersonId(person.getPersonId())
                .orElseThrow(() -> new ClientNotFoundException("No existe ese cliente: " + request.getClientName()));

        // Crear la cuenta
        Account account = new Account();
        account.setClient(client);
        account.setAccountNumber(request.getAccountNumber());
        account.setAccountType(request.getAccountType());
        account.setInitialBalance(request.getInitialBalance());
        account.setStatus(request.getStatus());

        return accountRepository.save(account);
    }

    @Transactional
    public Account createAccount(String clientName, Account accountData) {
        // Validar que no existe cuenta duplicada
        if (accountRepository.existsByAccountNumber(accountData.getAccountNumber())) {
            throw new DuplicateAccountException("Cuenta ya existe con número: " + accountData.getAccountNumber());
        }

        // Buscar person por nombre completo
        Person person = personRepository.findByFullName(clientName)
                .orElseThrow(() -> new ClientNotFoundException("No existe ese cliente: " + clientName));

        // Buscar client por person_id
        Client client = clientRepository.findByPerson_PersonId(person.getPersonId())
                .orElseThrow(() -> new ClientNotFoundException("No existe ese cliente: " + clientName));

        // Asignar el cliente a la cuenta
        accountData.setClient(client);

        return accountRepository.save(accountData);
    }

    @Transactional
    public Account updateAccount(Long id, Account accountData) {
        Account existingAccount = getAccountById(id);

        // Validar que no existe otra cuenta con el mismo número (si se cambió)
        if (!existingAccount.getAccountNumber().equals(accountData.getAccountNumber()) &&
            accountRepository.existsByAccountNumber(accountData.getAccountNumber())) {
            throw new DuplicateAccountException("Cuenta ya existe con número: " + accountData.getAccountNumber());
        }

        // Actualizar campos
        existingAccount.setAccountNumber(accountData.getAccountNumber());
        existingAccount.setAccountType(accountData.getAccountType());
        existingAccount.setInitialBalance(accountData.getInitialBalance());
        existingAccount.setStatus(accountData.getStatus());

        return accountRepository.save(existingAccount);
    }

    @Transactional
    public void deleteAccount(Long id) {
        Account account = getAccountById(id);
        accountRepository.delete(account);
    }
}