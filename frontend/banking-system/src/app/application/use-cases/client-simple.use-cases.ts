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
}