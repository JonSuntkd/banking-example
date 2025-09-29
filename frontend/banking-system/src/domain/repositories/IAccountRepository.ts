import { Account } from '../entities/Account';

export interface IAccountRepository {
    getAll(): Promise<Account[]>;
    getById(id: number): Promise<Account>;
    create(account: Account): Promise<Account>;
    update(id: number, account: Account): Promise<Account>;
    delete(id: number): Promise<void>;
}