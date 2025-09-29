import { Transaction } from '../../domain/entities/Transaction';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';

export class TransactionController {
    constructor(private repository: ITransactionRepository) {}

    async getAllTransactions(): Promise<Transaction[]> {
        return this.repository.getAll();
    }

    async createTransaction(transaction: Transaction): Promise<Transaction> {
        return this.repository.create(transaction);
    }

    async getTransactionReport(date: string): Promise<Transaction[]> {
        return this.repository.getReport(date);
    }

    async getTransactionReportByClientAndDateRange(startDate: string, endDate: string, clientName: string): Promise<any> {
        return this.repository.getReportByClientAndDateRange(startDate, endDate, clientName);
    }

    async updateTransaction(id: number, transaction: Transaction): Promise<Transaction> {
        return this.repository.update(id, transaction);
    }

    async deleteTransaction(id: number): Promise<void> {
        return this.repository.delete(id);
    }
}