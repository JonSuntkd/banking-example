import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountRepository } from '@domain/repositories/account.repository';
import { Account, AccountWithClientDto, AccountUpdateDto } from '@domain/entities/account.entity';

/**
 * HTTP implementation of AccountRepository
 */
@Injectable({
  providedIn: 'root'
})
export class AccountHttpRepository implements AccountRepository {
  private readonly baseUrl = 'http://localhost:8002/account';

  constructor(private readonly http: HttpClient) {}

  createAccountWithClient(account: AccountWithClientDto): Observable<Account> {
    return this.http.post<Account>(`${this.baseUrl}/with-client`, account);
  }

  getAllAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.baseUrl);
  }

  getAccountById(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/${id}`);
  }

  updateAccount(id: number, account: AccountUpdateDto): Observable<Account> {
    return this.http.put<Account>(`${this.baseUrl}/${id}`, account);
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}