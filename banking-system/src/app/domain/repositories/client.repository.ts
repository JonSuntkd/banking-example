import { Observable } from 'rxjs';
import { Client } from '../entities/client.entity';
import { CreateClientRequest } from '../../shared/types/api-types';

export abstract class ClientRepository {
  abstract getAll(): Observable<Client[]>;
  abstract getById(id: number): Observable<Client>;
  abstract createBasic(client: CreateClientRequest): Observable<Client>;
  abstract update(id: number, client: Client): Observable<Client>;
  abstract activate(id: number): Observable<void>;
  abstract deactivate(id: number): Observable<void>;
  abstract delete(id: number): Observable<void>;
}