import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client, ClientBasicDto, ClientUpdateDto } from '../../domain/entities/client.entity';

/**
 * Client Use Cases - Simplified version for demo
 */
@Injectable({
  providedIn: 'root'
})
export class ClientUseCases {
  private readonly baseUrl = 'http://localhost:8001/api/v1/client';

  constructor(private readonly http: HttpClient) {}

  /**
   * Create a new client with basic information
   */
  createBasicClient(clientData: ClientBasicDto): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}/basic`, clientData);
  }

  /**
   * Retrieve all clients from the system
   */
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }

  /**
   * Retrieve a specific client by ID
   */
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  /**
   * Update an existing client's information
   */
  updateClient(id: number, clientData: ClientUpdateDto): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/${id}`, clientData);
  }

  /**
   * Activate a client account
   */
  activateClient(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/activate`, {});
  }

  /**
   * Deactivate a client account
   */
  deactivateClient(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/deactivate`, {});
  }

  /**
   * Delete a client from the system
   */
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new client with basic information
   */
  createBasicClient(clientData: ClientBasicDto): Observable<Client> {
    this.validateClientBasicData(clientData);
    return this.clientRepository.createBasicClient(clientData);
  }

  /**
   * Retrieve all clients from the system
   */
  getAllClients(): Observable<Client[]> {
    return this.clientRepository.getAllClients();
  }

  /**
   * Retrieve a specific client by ID
   */
  getClientById(id: number): Observable<Client> {
    this.validateId(id);
    return this.clientRepository.getClientById(id);
  }

  /**
   * Update an existing client's information
   */
  updateClient(id: number, clientData: ClientUpdateDto): Observable<Client> {
    this.validateId(id);
    this.validateClientUpdateData(clientData);
    return this.clientRepository.updateClient(id, clientData);
  }

  /**
   * Activate a client account
   */
  activateClient(id: number): Observable<void> {
    this.validateId(id);
    return this.clientRepository.activateClient(id);
  }

  /**
   * Deactivate a client account
   */
  deactivateClient(id: number): Observable<void> {
    this.validateId(id);
    return this.clientRepository.deactivateClient(id);
  }

  /**
   * Delete a client from the system
   */
  deleteClient(id: number): Observable<void> {
    this.validateId(id);
    return this.clientRepository.deleteClient(id);
  }

  // Private validation methods following Clean Code principles
  private validateId(id: number): void {
    if (!id || id <= 0) {
      throw new Error('Invalid client ID provided');
    }
  }

  private validateClientBasicData(data: ClientBasicDto): void {
    if (!data.fullName?.trim()) {
      throw new Error('Full name is required');
    }
    if (!data.address?.trim()) {
      throw new Error('Address is required');
    }
    if (!data.phone?.trim()) {
      throw new Error('Phone is required');
    }
    if (!data.password?.trim()) {
      throw new Error('Password is required');
    }
    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  }

  private validateClientUpdateData(data: ClientUpdateDto): void {
    if (!data.person?.fullName?.trim()) {
      throw new Error('Full name is required');
    }
    if (!data.person?.address?.trim()) {
      throw new Error('Address is required');
    }
    if (!data.person?.phone?.trim()) {
      throw new Error('Phone is required');
    }
    if (!data.password?.trim()) {
      throw new Error('Password is required');
    }
  }
}