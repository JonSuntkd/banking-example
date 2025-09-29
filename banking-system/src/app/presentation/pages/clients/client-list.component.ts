import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientUseCases } from '../../../application/use-cases/client.use-cases';
import { Client } from '../../../domain/entities/client.entity';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="d-flex justify-content-between align-items-center">
          <h2>Gestión de Clientes</h2>
          <a routerLink="/clients/new" class="btn btn-primary">
            ➕ Nuevo Cliente
          </a>
        </div>
      </div>

      <div class="page-content">
        <!-- Buscador -->
        <div class="search-section">
          <div class="form-group">
            <input 
              type="text" 
              class="form-control" 
              placeholder="Buscar por nombre, teléfono o dirección..."
              [(ngModel)]="searchTerm"
              (input)="filterClients()">
          </div>
        </div>

        <!-- Mensajes de estado -->
        <div *ngIf="isLoading" class="text-center">
          <div class="loading"></div>
          <p>Cargando clientes...</p>
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
          <button class="btn btn-primary ml-2" (click)="loadClients()">
            Reintentar
          </button>
        </div>

        <!-- Tabla de clientes -->
        <div *ngIf="!isLoading && !error" class="table-section">
          <div *ngIf="filteredClients.length === 0" class="alert alert-warning">
            <span *ngIf="searchTerm">No se encontraron clientes que coincidan con "{{ searchTerm }}"</span>
            <span *ngIf="!searchTerm">No hay clientes registrados</span>
          </div>

          <div *ngIf="filteredClients.length > 0" class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre Completo</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let client of filteredClients; trackBy: trackByClientId">
                  <td>{{ client.id }}</td>
                  <td>{{ client.person.fullName }}</td>
                  <td>{{ client.person.phone }}</td>
                  <td class="address-cell">{{ client.person.address }}</td>
                  <td>
                    <span 
                      class="status-badge" 
                      [class.status-active]="client.status"
                      [class.status-inactive]="!client.status">
                      {{ client.status ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <a 
                        [routerLink]="['/clients', client.id, 'edit']" 
                        class="btn btn-sm btn-warning mr-2"
                        title="Editar">
                        ✏️
                      </a>
                      <button 
                        *ngIf="!client.status"
                        (click)="activateClient(client.id!)"
                        class="btn btn-sm btn-success mr-2"
                        [disabled]="isActivating"
                        title="Activar">
                        ✅
                      </button>
                      <button 
                        *ngIf="client.status"
                        (click)="deactivateClient(client.id!)"
                        class="btn btn-sm btn-secondary mr-2"
                        [disabled]="isDeactivating"
                        title="Desactivar">
                        ⏸️
                      </button>
                      <button 
                        (click)="confirmDelete(client)"
                        class="btn btn-sm btn-danger"
                        [disabled]="isDeleting"
                        title="Eliminar">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div *ngIf="showDeleteModal" class="modal-overlay" (click)="cancelDelete()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h4 class="modal-title">Confirmar Eliminación</h4>
        </div>
        <div class="modal-body">
          <p>¿Está seguro de que desea eliminar al cliente <strong>{{ clientToDelete?.person.fullName }}</strong>?</p>
          <p class="text-warning">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="cancelDelete()" [disabled]="isDeleting">
            Cancelar
          </button>
          <button class="btn btn-danger" (click)="deleteClient()" [disabled]="isDeleting">
            <span *ngIf="isDeleting" class="loading mr-2"></span>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm = '';
  isLoading = false;
  isActivating = false;
  isDeactivating = false;
  isDeleting = false;
  error = '';
  
  showDeleteModal = false;
  clientToDelete: Client | null = null;

  constructor(private clientUseCases: ClientUseCases) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.error = '';

    this.clientUseCases.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.filteredClients = clients;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.isLoading = false;
        console.error('Error loading clients:', error);
      }
    });
  }

  filterClients(): void {
    if (!this.searchTerm.trim()) {
      this.filteredClients = [...this.clients];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredClients = this.clients.filter(client =>
      client.person.fullName.toLowerCase().includes(term) ||
      client.person.phone.toLowerCase().includes(term) ||
      client.person.address.toLowerCase().includes(term)
    );
  }

  activateClient(id: number): void {
    this.isActivating = true;
    
    this.clientUseCases.activateClient(id).subscribe({
      next: () => {
        this.loadClients();
        this.isActivating = false;
      },
      error: (error) => {
        this.error = error.message;
        this.isActivating = false;
        console.error('Error activating client:', error);
      }
    });
  }

  deactivateClient(id: number): void {
    this.isDeactivating = true;
    
    this.clientUseCases.deactivateClient(id).subscribe({
      next: () => {
        this.loadClients();
        this.isDeactivating = false;
      },
      error: (error) => {
        this.error = error.message;
        this.isDeactivating = false;
        console.error('Error deactivating client:', error);
      }
    });
  }

  confirmDelete(client: Client): void {
    this.clientToDelete = client;
    this.showDeleteModal = true;
  }

  deleteClient(): void {
    if (!this.clientToDelete?.id) return;

    this.isDeleting = true;
    
    this.clientUseCases.deleteClient(this.clientToDelete.id).subscribe({
      next: () => {
        this.loadClients();
        this.cancelDelete();
        this.isDeleting = false;
      },
      error: (error) => {
        this.error = error.message;
        this.isDeleting = false;
        console.error('Error deleting client:', error);
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.clientToDelete = null;
  }

  trackByClientId(index: number, client: Client): number {
    return client.id || index;
  }
}