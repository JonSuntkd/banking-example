import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account, CreateAccountWithClient } from '../../domain/entities/account.entity';
import { AccountRepository } from '../../domain/repositories/account.repository';

@Injectable({
  providedIn: 'root'
})
export class AccountUseCases {
  constructor(private readonly accountRepository: AccountRepository) {}

  getAllAccounts(): Observable<Account[]> {
    return this.accountRepository.getAll();
  }

  getAccountById(id: number): Observable<Account> {
    return this.accountRepository.getById(id);
  }

  createAccountWithClient(account: CreateAccountWithClient): Observable<Account> {
    this.validateAccountData(account);
    return this.accountRepository.createWithClient(account);
  }

  updateAccount(id: number, account: Account): Observable<Account> {
    this.validateUpdateData(account);
    return this.accountRepository.update(id, account);
  }

  deleteAccount(id: number): Observable<void> {
    return this.accountRepository.delete(id);
  }

  private validateAccountData(account: CreateAccountWithClient): void {
    if (!account.accountNumber || account.accountNumber.trim().length < 4) {
      throw new Error('El número de cuenta es requerido y debe tener al menos 4 dígitos');
    }

    if (!account.accountType || !['Ahorro', 'Corriente', 'Credito'].includes(account.accountType)) {
      throw new Error('El tipo de cuenta debe ser: Ahorro, Corriente o Credito');
    }

    if (account.initialBalance < 0) {
      throw new Error('El saldo inicial no puede ser negativo');
    }

    if (!account.clientName || account.clientName.trim().length < 2) {
      throw new Error('El nombre del cliente es requerido');
    }
  }

  private validateUpdateData(account: Account): void {
    if (!account.accountNumber || account.accountNumber.trim().length < 4) {
      throw new Error('El número de cuenta es requerido y debe tener al menos 4 dígitos');
    }

    if (!account.accountType || !['Ahorro', 'Corriente', 'Credito'].includes(account.accountType)) {
      throw new Error('El tipo de cuenta debe ser: Ahorro, Corriente o Credito');
    }

    if (account.initialBalance < 0) {
      throw new Error('El saldo inicial no puede ser negativo');
    }
  }
}