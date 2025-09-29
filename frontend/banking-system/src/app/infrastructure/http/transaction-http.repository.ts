import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransactionRepository } from '@domain/repositories/transaction.repository';
import { Transaction, TransactionCreateDto, TransactionUpdateDto, TransactionReportDto } from '@domain/entities/transaction.entity';

/**
 * HTTP implementation of TransactionRepository
 */
@Injectable({
  providedIn: 'root'
})
export class TransactionHttpRepository implements TransactionRepository {
  private readonly baseUrl = 'http://localhost:8003/transaction';

  constructor(private readonly http: HttpClient) {}

  createTransaction(transaction: TransactionCreateDto): Observable<Transaction> {
    return this.http.post<Transaction>(this.baseUrl, transaction);
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.baseUrl);
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/${id}`);
  }

  updateTransaction(id: number, transaction: TransactionUpdateDto): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.baseUrl}/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getTransactionReport(date: string): Observable<TransactionReportDto[]> {
    return this.http.get<TransactionReportDto[]>(`${this.baseUrl}/report?date=${encodeURIComponent(date)}`);
  }
}