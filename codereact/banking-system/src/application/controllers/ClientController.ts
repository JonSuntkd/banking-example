import { Client } from '../../domain/entities/Client';
import { IClientRepository } from '../../domain/repositories/IClientRepository';

export class ClientController {
    constructor(private repository: IClientRepository) {}

    async getAllClients(): Promise<Client[]> {
        return this.repository.getAll();
    }

    async getClientById(id: number): Promise<Client> {
        return this.repository.getById(id);
    }

    async createClient(client: Client): Promise<Client> {
        return this.repository.create(client);
    }

    async updateClient(id: number, client: Client): Promise<Client> {
        return this.repository.update(id, client);
    }

    async deleteClient(id: number): Promise<void> {
        return this.repository.delete(id);
    }

    async activateClient(id: number): Promise<void> {
        return this.repository.activate(id);
    }

    async deactivateClient(id: number): Promise<void> {
        return this.repository.deactivate(id);
    }
}