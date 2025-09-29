import { Transaction } from '../entities/Transaction';

export interface ITransactionRepository {
    getAll(): Promise<Transaction[]>;
    create(transaction: Transaction): Promise<Transaction>;
    getReport(date: string): Promise<Transaction[]>;
    getReportByClientAndDateRange(startDate: string, endDate: string, clientName: string): Promise<any>;
    update(id: number, transaction: Transaction): Promise<Transaction>;
    delete(id: number): Promise<void>;
}