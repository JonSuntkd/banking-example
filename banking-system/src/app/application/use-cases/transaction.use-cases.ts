import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction, TransactionReport } from '../../domain/entities/transaction.entity';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

@Injectable({
  providedIn: 'root'
})
export class TransactionUseCases {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  getAllTransactions(): Observable<Transaction[]> {
    return this.transactionRepository.getAll();
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.transactionRepository.getById(id);
  }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    this.validateTransactionData(transaction);
    return this.transactionRepository.create(transaction);
  }

  updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
    this.validateTransactionData(transaction);
    return this.transactionRepository.update(id, transaction);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.transactionRepository.delete(id);
  }

  getTransactionReport(date: string): Observable<TransactionReport[]> {
    this.validateDateFormat(date);
    return this.transactionRepository.getReport(date);
  }

  private validateTransactionData(transaction: Transaction): void {
    if (!transaction.accountNumber || transaction.accountNumber.trim().length < 4) {
      throw new Error('El número de cuenta es requerido y debe tener al menos 4 dígitos');
    }

    if (!transaction.transactionType || !['Deposito', 'Retiro'].includes(transaction.transactionType)) {
      throw new Error('El tipo de transacción debe ser: Deposito o Retiro');
    }

    if (transaction.amount <= 0) {
      throw new Error('El monto debe ser mayor a 0');
    }

    if (transaction.amount > 10000) {
      throw new Error('El monto no puede exceder $10,000 por transacción');
    }
  }

  private validateDateFormat(date: string): void {
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (!dateRegex.test(date)) {
      throw new Error('El formato de fecha debe ser: DD/MM/YYYY o D/M/YYYY');
    }

    const [day, month, year] = date.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    if (dateObj.getFullYear() !== year || 
        dateObj.getMonth() !== month - 1 || 
        dateObj.getDate() !== day) {
      throw new Error('La fecha proporcionada no es válida');
    }
  }
}