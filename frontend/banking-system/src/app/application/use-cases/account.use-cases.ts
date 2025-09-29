import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountRepository } from '@domain/repositories/account.repository';
import { Account, AccountWithClientDto, AccountUpdateDto } from '@domain/entities/account.entity';

/**
 * Account Use Cases following Single Responsibility Principle
 */
@Injectable({
  providedIn: 'root'
})
export class AccountUseCases {
  constructor(private readonly accountRepository: AccountRepository) {}

  /**
   * Create a new account with client information
   */
  createAccountWithClient(accountData: AccountWithClientDto): Observable<Account> {
    this.validateAccountWithClientData(accountData);
    return this.accountRepository.createAccountWithClient(accountData);
  }

  /**
   * Retrieve all accounts from the system
   */
  getAllAccounts(): Observable<Account[]> {
    return this.accountRepository.getAllAccounts();
  }

  /**
   * Retrieve a specific account by ID
   */
  getAccountById(id: number): Observable<Account> {
    this.validateId(id);
    return this.accountRepository.getAccountById(id);
  }

  /**
   * Update an existing account's information
   */
  updateAccount(id: number, accountData: AccountUpdateDto): Observable<Account> {
    this.validateId(id);
    this.validateAccountUpdateData(accountData);
    return this.accountRepository.updateAccount(id, accountData);
  }

  /**
   * Delete an account from the system
   */
  deleteAccount(id: number): Observable<void> {
    this.validateId(id);
    return this.accountRepository.deleteAccount(id);
  }

  // Private validation methods
  private validateId(id: number): void {
    if (!id || id <= 0) {
      throw new Error('Invalid account ID provided');
    }
  }

  private validateAccountWithClientData(data: AccountWithClientDto): void {
    if (!data.accountNumber?.trim()) {
      throw new Error('Account number is required');
    }
    if (!data.accountType) {
      throw new Error('Account type is required');
    }
    if (data.initialBalance < 0) {
      throw new Error('Initial balance cannot be negative');
    }
    if (!data.clientName?.trim()) {
      throw new Error('Client name is required');
    }
  }

  private validateAccountUpdateData(data: AccountUpdateDto): void {
    if (!data.accountNumber?.trim()) {
      throw new Error('Account number is required');
    }
    if (!data.accountType) {
      throw new Error('Account type is required');
    }
    if (data.initialBalance < 0) {
      throw new Error('Initial balance cannot be negative');
    }
  }
}