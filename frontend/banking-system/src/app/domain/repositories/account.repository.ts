import { Observable } from 'rxjs';
import { Account, AccountWithClientDto, AccountUpdateDto } from '../entities/account.entity';

/**
 * Repository interface for Account operations following the Repository pattern
 */
export interface AccountRepository {
  /**
   * Create account with client information
   */
  createAccountWithClient(account: AccountWithClientDto): Observable<Account>;

  /**
   * Get all accounts
   */
  getAllAccounts(): Observable<Account[]>;

  /**
   * Get account by ID
   */
  getAccountById(id: number): Observable<Account>;

  /**
   * Update existing account
   */
  updateAccount(id: number, account: AccountUpdateDto): Observable<Account>;

  /**
   * Delete account
   */
  deleteAccount(id: number): Observable<void>;
}