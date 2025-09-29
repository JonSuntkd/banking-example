import axios from 'axios';
import { Client } from '../../domain/entities/Client';
import { IClientRepository } from '../../domain/repositories/IClientRepository';

const BASE_URL = '/api/v1/client';

export class ClientApiRepository implements IClientRepository {
    async getAll(): Promise<Client[]> {
        try {
            console.log('Making request to:', BASE_URL);
            const response = await axios.get(BASE_URL);
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);
            
            // Verificar si la respuesta es un array
            if (!Array.isArray(response.data)) {
                console.error('Expected array but got:', typeof response.data, response.data);
                throw new Error('Server response is not an array');
            }
            
            return response.data;
        } catch (error) {
            console.error('Error in getAll:', error);
            if (axios.isAxiosError(error)) {
                console.error('Response status:', error.response?.status);
                console.error('Response data:', error.response?.data);
                console.error('Response headers:', error.response?.headers);
            }
            throw error;
        }
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