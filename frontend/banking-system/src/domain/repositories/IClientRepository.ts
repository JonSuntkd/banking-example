import { Client } from '../entities/Client';

export interface IClientRepository {
    getAll(): Promise<Client[]>;
    getById(id: number): Promise<Client>;
    create(client: Client): Promise<Client>;
    update(id: number, client: Client): Promise<Client>;
    delete(id: number): Promise<void>;
    activate(id: number): Promise<void>;
    deactivate(id: number): Promise<void>;
}