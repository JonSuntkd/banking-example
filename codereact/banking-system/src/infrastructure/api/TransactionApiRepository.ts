import axios from 'axios';
import { Transaction } from '../../domain/entities/Transaction';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';

const BASE_URL = '/transaction';

export class TransactionApiRepository implements ITransactionRepository {
    async getAll(): Promise<Transaction[]> {
        const response = await axios.get(BASE_URL);
        return response.data;
    }

    async create(transaction: Transaction): Promise<Transaction> {
        const response = await axios.post(BASE_URL, transaction);
        return response.data;
    }

    async getReport(date: string): Promise<Transaction[]> {
        const response = await axios.get(`${BASE_URL}/report?date=${date}`);
        return response.data;
    }

    async update(id: number, transaction: Transaction): Promise<Transaction> {
        const response = await axios.put(`${BASE_URL}/${id}`, transaction);
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await axios.delete(`${BASE_URL}/${id}`);
    }
}