import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientRepository } from '@domain/repositories/client.repository';
import { Client, ClientBasicDto, ClientUpdateDto } from '@domain/entities/client.entity';

/**
 * HTTP implementation of ClientRepository
 * Handles all HTTP communication with the client microservice
 */
@Injectable({
  providedIn: 'root'
})
export class ClientHttpRepository implements ClientRepository {
  private readonly baseUrl = 'http://localhost:8001/api/v1/client';

  constructor(private readonly http: HttpClient) {}

  createBasicClient(client: ClientBasicDto): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}/basic`, client);
  }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl);
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  updateClient(id: number, client: ClientUpdateDto): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/${id}`, client);
  }

  activateClient(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/activate`, {});
  }

  deactivateClient(id: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/deactivate`, {});
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}