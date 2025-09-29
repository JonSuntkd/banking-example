import { Observable } from 'rxjs';
import { Client, ClientBasicDto, ClientUpdateDto } from '../entities/client.entity';

/**
 * Repository interface for Client operations following the Repository pattern
 * This interface defines the contract for client data operations
 */
export interface ClientRepository {
  /**
   * Create a new client using basic registration
   */
  createBasicClient(client: ClientBasicDto): Observable<Client>;

  /**
   * Get all clients
   */
  getAllClients(): Observable<Client[]>;

  /**
   * Get client by ID
   */
  getClientById(id: number): Observable<Client>;

  /**
   * Update existing client
   */
  updateClient(id: number, client: ClientUpdateDto): Observable<Client>;

  /**
   * Activate client account
   */
  activateClient(id: number): Observable<void>;

  /**
   * Deactivate client account
   */
  deactivateClient(id: number): Observable<void>;

  /**
   * Delete client
   */
  deleteClient(id: number): Observable<void>;
}