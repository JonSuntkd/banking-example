import { Observable } from 'rxjs';
import { Account, CreateAccountWithClient } from '../entities/account.entity';

export abstract class AccountRepository {
  abstract getAll(): Observable<Account[]>;
  abstract getById(id: number): Observable<Account>;
  abstract createWithClient(account: CreateAccountWithClient): Observable<Account>;
  abstract update(id: number, account: Account): Observable<Account>;
  abstract delete(id: number): Observable<void>;
}