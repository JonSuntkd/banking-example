import axios from 'axios';
import { Account } from '../../domain/entities/Account';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';

const BASE_URL = '/account';

export class AccountApiRepository implements IAccountRepository {
    async getAll(): Promise<Account[]> {
        const response = await axios.get(BASE_URL);
        return response.data;
    }

    async getById(id: number): Promise<Account> {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    }

    async create(account: Account): Promise<Account> {
        const response = await axios.post(`${BASE_URL}/with-client`, account);
        return response.data;
    }

    async update(id: number, account: Account): Promise<Account> {
        const response = await axios.put(`${BASE_URL}/${id}`, account);
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await axios.delete(`${BASE_URL}/${id}`);
    }
}