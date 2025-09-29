import axios from 'axios';
import { Client } from '../../domain/entities/Client';
import { IClientRepository } from '../../domain/repositories/IClientRepository';

const BASE_URL = '/api/v1/client';

export class ClientApiRepository implements IClientRepository {
    async getAll(): Promise<Client[]> {
        const response = await axios.get(BASE_URL);
        return response.data;
    }



    async getById(id: number): Promise<Client> {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    }

    async create(client: Client): Promise<Client> {
        const response = await axios.post(`${BASE_URL}/basic`, client);
        return response.data;
    }

    async update(id: number, client: Client): Promise<Client> {
        const response = await axios.put(`${BASE_URL}/${id}`, client);
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await axios.delete(`${BASE_URL}/${id}`);
    }

    async activate(id: number): Promise<void> {
        await axios.patch(`${BASE_URL}/${id}/activate`);
    }

    async deactivate(id: number): Promise<void> {
        await axios.patch(`${BASE_URL}/${id}/deactivate`);
    }
}