import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client } from '../../domain/entities/client.entity';
import { ClientRepository } from '../../domain/repositories/client.repository';
import { CreateClientRequest } from '../../shared/types/api-types';

@Injectable({
  providedIn: 'root'
})
export class ClientUseCases {
  constructor(private clientRepository: ClientRepository) {}

  getAllClients(): Observable<Client[]> {
    return this.clientRepository.getAll();
  }

  getClientById(id: number): Observable<Client> {
    return this.clientRepository.getById(id);
  }

  createBasicClient(client: CreateClientRequest): Observable<Client> {
    this.validateClientData(client);
    return this.clientRepository.createBasic(client);
  }

  updateClient(id: number, client: Client): Observable<Client> {
    this.validateUpdateData(client);
    return this.clientRepository.update(id, client);
  }

  activateClient(id: number): Observable<void> {
    return this.clientRepository.activate(id);
  }

  deactivateClient(id: number): Observable<void> {
    return this.clientRepository.deactivate(id);
  }

  deleteClient(id: number): Observable<void> {
    return this.clientRepository.delete(id);
  }

  private validateClientData(client: CreateClientRequest): void {
    if (!client.fullName || client.fullName.trim().length < 2) {
      throw new Error('El nombre completo es requerido y debe tener al menos 2 caracteres');
    }

    if (!client.address || client.address.trim().length < 5) {
      throw new Error('La dirección es requerida y debe tener al menos 5 caracteres');
    }

    if (!client.phone || !this.isValidPhoneNumber(client.phone)) {
      throw new Error('El teléfono debe tener un formato válido (+593-XX-XXX-XXXX)');
    }

    if (!client.password || client.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }
  }

  private validateUpdateData(client: Client): void {
    if (!client.person.fullName || client.person.fullName.trim().length < 2) {
      throw new Error('El nombre completo es requerido y debe tener al menos 2 caracteres');
    }

    if (!client.person.address || client.person.address.trim().length < 5) {
      throw new Error('La dirección es requerida y debe tener al menos 5 caracteres');
    }

    if (!client.person.phone || !this.isValidPhoneNumber(client.person.phone)) {
      throw new Error('El teléfono debe tener un formato válido (+593-XX-XXX-XXXX)');
    }

    if (client.person.age !== undefined && (client.person.age < 18 || client.person.age > 120)) {
      throw new Error('La edad debe estar entre 18 y 120 años');
    }
  }

  private isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+593-\d{2}-\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  }
}