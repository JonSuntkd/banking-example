import { Transaction } from '../entities/Transaction';

export interface ITransactionRepository {
    getAll(): Promise<Transaction[]>;
    create(transaction: Transaction): Promise<Transaction>;
    getReport(date: string): Promise<Transaction[]>;
    update(id: number, transaction: Transaction): Promise<Transaction>;
    delete(id: number): Promise<void>;
}