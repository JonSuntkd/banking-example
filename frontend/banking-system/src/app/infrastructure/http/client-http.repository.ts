import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
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
  private readonly baseUrl = '/api/v1/client';

  constructor(private readonly http: HttpClient) {}

  createBasicClient(client: ClientBasicDto): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}/basic`, client);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.baseUrl)
      .pipe(
        retry(3),
        catchError((error) => this.handleError(error))
      );
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