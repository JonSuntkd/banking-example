import { Observable } from 'rxjs';
import { Transaction, TransactionCreateDto, TransactionUpdateDto, TransactionReportDto } from '../entities/transaction.entity';

/**
 * Repository interface for Transaction operations following the Repository pattern
 */
export interface TransactionRepository {
  /**
   * Create a new transaction
   */
  createTransaction(transaction: TransactionCreateDto): Observable<Transaction>;

  /**
   * Get all transactions
   */
  getAllTransactions(): Observable<Transaction[]>;

  /**
   * Get transaction by ID
   */
  getTransactionById(id: number): Observable<Transaction>;

  /**
   * Update existing transaction
   */
  updateTransaction(id: number, transaction: TransactionUpdateDto): Observable<Transaction>;

  /**
   * Delete transaction
   */
  deleteTransaction(id: number): Observable<void>;

  /**
   * Get transaction report by date
   */
  getTransactionReport(date: string): Observable<TransactionReportDto[]>;
}