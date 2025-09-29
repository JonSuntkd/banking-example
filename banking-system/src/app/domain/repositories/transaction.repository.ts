import { Observable } from 'rxjs';
import { Transaction, TransactionReport } from '../entities/transaction.entity';

export abstract class TransactionRepository {
  abstract getAll(): Observable<Transaction[]>;
  abstract getById(id: number): Observable<Transaction>;
  abstract create(transaction: Transaction): Observable<Transaction>;
  abstract update(id: number, transaction: Transaction): Observable<Transaction>;
  abstract delete(id: number): Observable<void>;
  abstract getReport(date: string): Observable<TransactionReport[]>;
}