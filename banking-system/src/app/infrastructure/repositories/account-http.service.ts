import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { Account, CreateAccountWithClient } from '../../domain/entities/account.entity';

@Injectable({
  providedIn: 'root'
})
export class AccountHttpService implements AccountRepository {
  private readonly apiUrl = 'http://localhost:8002/account';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getById(id: number): Observable<Account> {
    return this.http.get<Account>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createWithClient(account: CreateAccountWithClient): Observable<Account> {
    return this.http.post<Account>(`${this.apiUrl}/with-client`, account).pipe(
      catchError(this.handleError)
    );
  }

  update(id: number, account: Account): Observable<Account> {
    return this.http.put<Account>(`${this.apiUrl}/${id}`, account).pipe(
      catchError(this.handleError)
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Datos inválidos proporcionados';
          break;
        case 404:
          errorMessage = 'Cuenta no encontrada';
          break;
        case 409:
          errorMessage = 'Número de cuenta ya existe';
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