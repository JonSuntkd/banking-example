import { Account } from '../../domain/entities/Account';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';

export class AccountController {
    constructor(private repository: IAccountRepository) {}

    async getAllAccounts(): Promise<Account[]> {
        return this.repository.getAll();
    }

    async getAccountById(id: number): Promise<Account> {
        return this.repository.getById(id);
    }

    async createAccount(account: Account): Promise<Account> {
        return this.repository.create(account);
    }

    async updateAccount(id: number, account: Account): Promise<Account> {
        return this.repository.update(id, account);
    }

    async deleteAccount(id: number): Promise<void> {
        return this.repository.delete(id);
    }
}