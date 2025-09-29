import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ClientUseCases } from '../../../../application/use-cases/client-simple.use-cases';
import { Client } from '../../../../domain/entities/client.entity';

/**
 * Client List Component following MVC pattern
 * Controller for managing client list view and operations
 */
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';

  private destroy$ = new Subject<void>();

  constructor(
    private readonly clientUseCases: ClientUseCases,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all clients from the system
   */
  loadClients(): void {
    this.loading = true;
    this.error = null;

    this.clientUseCases.getAllClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clients: Client[]) => {
          this.clients = clients;
          this.filteredClients = clients;
          this.loading = false;
        },
        error: (error: any) => {
          this.error = 'Error al cargar los clientes: ' + error.message;
          this.loading = false;
        }
      });
  }

  /**
   * Filter clients based on search term
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      this.filteredClients = this.clients;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredClients = this.clients.filter(client =>
      client.person.fullName.toLowerCase().includes(term) ||
      client.person.phone.toLowerCase().includes(term) ||
      client.person.address.toLowerCase().includes(term)
    );
  }

  /**
   * Navigate to create new client form
   */
  createClient(): void {
    this.router.navigate(['/clientes/nuevo']);
  }

  /**
   * Navigate to edit client form
   */
  editClient(clientId: number): void {
    this.router.navigate(['/clientes/editar', clientId]);
  }

  /**
   * Activate client account
   */
  activateClient(clientId: number): void {
    if (!confirm('¿Está seguro de que desea activar este cliente?')) {
      return;
    }

    this.clientUseCases.activateClient(clientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadClients();
        },
        error: (error: any) => {
          this.error = 'Error al activar el cliente: ' + error.message;
        }
      });
  }

  /**
   * Deactivate client account
   */
  deactivateClient(clientId: number): void {
    if (!confirm('¿Está seguro de que desea desactivar este cliente?')) {
      return;
    }

    this.clientUseCases.deactivateClient(clientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadClients();
        },
        error: (error: any) => {
          this.error = 'Error al desactivar el cliente: ' + error.message;
        }
      });
  }

  /**
   * Delete client from the system
   */
  deleteClient(clientId: number): void {
    if (!confirm('¿Está seguro de que desea eliminar este cliente? Esta acción no se puede deshacer.')) {
      return;
    }

    this.clientUseCases.deleteClient(clientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadClients();
        },
        error: (error: any) => {
          this.error = 'Error al eliminar el cliente: ' + error.message;
        }
      });
  }

  /**
   * Get status badge class for client
   */
  getStatusClass(status: boolean): string {
    return status ? 'status-active' : 'status-inactive';
  }

  /**
   * Get status text for client
   */
  getStatusText(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }

  /**
   * Track by function for ngFor optimization
   */
  trackByClientId(index: number, client: Client): number {
    return client.id || index;
  }
}