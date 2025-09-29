import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ClientRepository } from '../../domain/repositories/client.repository';
import { Client } from '../../domain/entities/client.entity';
import { CreateClientRequest, ClientResponse } from '../../shared/types/api-types';

@Injectable({
  providedIn: 'root'
})
export class ClientHttpService implements ClientRepository {
  private readonly apiUrl = 'http://localhost:8001/api/v1/client';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Client[]> {
    return this.http.get<ClientResponse[]>(this.apiUrl).pipe(
      map(responses => responses.map(this.mapResponseToClient)),
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Client> {
    return this.http.get<ClientResponse>(`${this.apiUrl}/${id}`).pipe(
      map(this.mapResponseToClient),
      catchError(this.handleError)
    );
  }

  createBasic(client: CreateClientRequest): Observable<Client> {
    return this.http.post<ClientResponse>(`${this.apiUrl}/basic`, client).pipe(
      map(this.mapResponseToClient),
      catchError(this.handleError)
    );
  }

  update(id: number, client: Client): Observable<Client> {
    return this.http.put<ClientResponse>(`${this.apiUrl}/${id}`, client).pipe(
      map(this.mapResponseToClient),
      catchError(this.handleError)
    );
  }

  activate(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/activate`, {}).pipe(
      catchError(this.handleError)
    );
  }

  deactivate(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/deactivate`, {}).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private mapResponseToClient(response: ClientResponse): Client {
    return {
      id: response.id,
      person: response.person,
      password: response.password,
      status: response.status
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 400:
          errorMessage = 'Datos inválidos proporcionados';
          break;
        case 404:
          errorMessage = 'Cliente no encontrado';
          break;
        case 409:
          errorMessage = 'Cliente ya existe o conflicto de datos';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error del servidor: ${error.status}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}