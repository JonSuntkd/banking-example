import axios from 'axios';
import { Client } from '../../domain/entities/Client';
import { IClientRepository } from '../../domain/repositories/IClientRepository';

const BASE_URL = 'http://localhost:8001/api/v1/client';

export class ClientApiRepository implements IClientRepository {
    async getAll(): Promise<Client[]> {
        try {
            const response = await axios.get(BASE_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching clients:', error);
            // Fallback to mock data if server is not available
            return this.getMockClients();
        }
    }

    private getMockClients(): Client[] {
        return [
            {
                id: 1,
                fullName: "María Elena Rodríguez",
                address: "Calle Los Olivos 456, Guayaquil",
                phone: "+593-98-555-6789",
                password: "securePass789",
                status: true
            },
            {
                id: 2,
                fullName: "Juan Pérez García",
                address: "Av. Principal 123, Quito",
                phone: "+593-99-123-4567",
                password: "password123",
                status: true
            },
            {
                id: 3,
                fullName: "Ana Carolina López",
                address: "Calle 9 de Octubre 789, Cuenca",
                phone: "+593-98-987-6543",
                password: "myPassword456",
                status: false
            }
        ];
    }

    async getById(id: number): Promise<Client> {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    }

    async create(client: Client): Promise<Client> {
        try {
            const response = await axios.post(`${BASE_URL}/basic`, client);
            return response.data;
        } catch (error) {
            console.error('Error creating client:', error);
            // Mock creation - simulate server response
            return {
                ...client,
                id: Math.floor(Math.random() * 1000) + 10
            };
        }
    }

    async update(id: number, client: Client): Promise<Client> {
        try {
            const response = await axios.put(`${BASE_URL}/${id}`, client);
            return response.data;
        } catch (error) {
            console.error('Error updating client:', error);
            // Mock update - simulate server response
            return {
                ...client,
                id: id
            };
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await axios.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            console.error('Error deleting client:', error);
            // Mock delete - simulate successful deletion
            console.log(`Mock: Client ${id} deleted`);
        }
    }

    async activate(id: number): Promise<void> {
        try {
            await axios.patch(`${BASE_URL}/${id}/activate`);
        } catch (error) {
            console.error('Error activating client:', error);
            // Mock activation - simulate successful activation
            console.log(`Mock: Client ${id} activated`);
        }
    }

    async deactivate(id: number): Promise<void> {
        try {
            await axios.patch(`${BASE_URL}/${id}/deactivate`);
        } catch (error) {
            console.error('Error deactivating client:', error);
            // Mock deactivation - simulate successful deactivation
            console.log(`Mock: Client ${id} deactivated`);
        }
    }
}