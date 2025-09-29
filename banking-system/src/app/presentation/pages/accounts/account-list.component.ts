import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountUseCases } from '../../../application/use-cases/account.use-cases';
import { Account } from '../../../domain/entities/account.entity';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="d-flex justify-content-between align-items-center">
          <h2>Gestión de Cuentas</h2>
          <a routerLink="/accounts/new" class="btn btn-primary">
            ➕ Nueva Cuenta
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
              placeholder="Buscar por número de cuenta, tipo o cliente..."
              [(ngModel)]="searchTerm"
              (input)="filterAccounts()">
          </div>
        </div>

        <!-- Filtros -->
        <div class="filters-section">
          <div class="filter-group">
            <label class="filter-label">Tipo de Cuenta:</label>
            <select class="form-control" [(ngModel)]="filterType" (change)="filterAccounts()">
              <option value="">Todos los tipos</option>
              <option value="Ahorro">Ahorro</option>
              <option value="Corriente">Corriente</option>
              <option value="Credito">Crédito</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">Estado:</label>
            <select class="form-control" [(ngModel)]="filterStatus" (change)="filterAccounts()">
              <option value="">Todos los estados</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </div>

        <!-- Mensajes de estado -->
        <div *ngIf="isLoading" class="text-center">
          <div class="loading"></div>
          <p>Cargando cuentas...</p>
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
          <button class="btn btn-primary ml-2" (click)="loadAccounts()">
            Reintentar
          </button>
        </div>

        <!-- Tabla de cuentas -->
        <div *ngIf="!isLoading && !error" class="table-section">
          <div *ngIf="filteredAccounts.length === 0" class="alert alert-warning">
            <span *ngIf="searchTerm || filterType || filterStatus">No se encontraron cuentas que coincidan con los filtros aplicados</span>
            <span *ngIf="!searchTerm && !filterType && !filterStatus">No hay cuentas registradas</span>
          </div>

          <div *ngIf="filteredAccounts.length > 0" class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Número de Cuenta</th>
                  <th>Tipo</th>
                  <th>Saldo Inicial</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let account of filteredAccounts; trackBy: trackByAccountId">
                  <td class="account-number">{{ account.accountNumber }}</td>
                  <td>
                    <span class="account-type" [ngClass]="getAccountTypeClass(account.accountType)">
                      {{ account.accountType }}
                    </span>
                  </td>
                  <td class="balance-cell">
                    ${{ account.initialBalance | number:'1.2-2' }}
                  </td>
                  <td>{{ account.clientName }}</td>
                  <td>
                    <span 
                      class="status-badge" 
                      [class.status-active]="account.status"
                      [class.status-inactive]="!account.status">
                      {{ account.status ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <a 
                        [routerLink]="['/accounts', account.id, 'edit']" 
                        class="btn btn-sm btn-warning mr-2"
                        title="Editar">
                        ✏️
                      </a>
                      <button 
                        (click)="confirmDelete(account)"
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

          <!-- Resumen -->
          <div *ngIf="filteredAccounts.length > 0" class="summary-section">
            <div class="summary-cards">
              <div class="summary-card">
                <div class="summary-value">{{ filteredAccounts.length }}</div>
                <div class="summary-label">Total Cuentas</div>
              </div>
              <div class="summary-card">
                <div class="summary-value">{{ getTotalBalance() | number:'1.2-2' }}</div>
                <div class="summary-label">Saldo Total</div>
              </div>
              <div class="summary-card">
                <div class="summary-value">{{ getActiveAccountsCount() }}</div>
                <div class="summary-label">Cuentas Activas</div>
              </div>
            </div>
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
          <p>¿Está seguro de que desea eliminar la cuenta <strong>{{ accountToDelete?.accountNumber }}</strong>?</p>
          <p><strong>Cliente:</strong> {{ accountToDelete?.clientName }}</p>
          <p><strong>Saldo:</strong> ${{ accountToDelete?.initialBalance | number:'1.2-2' }}</p>
          <p class="text-warning">Esta acción no se puede deshacer.</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="cancelDelete()" [disabled]="isDeleting">
            Cancelar
          </button>
          <button class="btn btn-danger" (click)="deleteAccount()" [disabled]="isDeleting">
            <span *ngIf="isDeleting" class="loading mr-2"></span>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];
  searchTerm = '';
  filterType = '';
  filterStatus = '';
  isLoading = false;
  isDeleting = false;
  error = '';
  
  showDeleteModal = false;
  accountToDelete: Account | null = null;

  constructor(private readonly accountUseCases: AccountUseCases) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading = true;
    this.error = '';

    this.accountUseCases.getAllAccounts().subscribe({
      next: (accounts: Account[]) => {
        this.accounts = accounts;
        this.filteredAccounts = accounts;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = error.message;
        this.isLoading = false;
        console.error('Error loading accounts:', error);
      }
    });
  }

  filterAccounts(): void {
    let filtered = [...this.accounts];

    // Filtro por término de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(account =>
        account.accountNumber.toLowerCase().includes(term) ||
        account.accountType.toLowerCase().includes(term) ||
        (account.clientName && account.clientName.toLowerCase().includes(term))
      );
    }

    // Filtro por tipo
    if (this.filterType) {
      filtered = filtered.filter(account => account.accountType === this.filterType);
    }

    // Filtro por estado
    if (this.filterStatus !== '') {
      const status = this.filterStatus === 'true';
      filtered = filtered.filter(account => account.status === status);
    }

    this.filteredAccounts = filtered;
  }

  confirmDelete(account: Account): void {
    this.accountToDelete = account;
    this.showDeleteModal = true;
  }

  deleteAccount(): void {
    if (!this.accountToDelete?.id) return;

    this.isDeleting = true;
    
    this.accountUseCases.deleteAccount(this.accountToDelete.id).subscribe({
      next: () => {
        this.loadAccounts();
        this.cancelDelete();
        this.isDeleting = false;
      },
      error: (error: any) => {
        this.error = error.message;
        this.isDeleting = false;
        console.error('Error deleting account:', error);
      }
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.accountToDelete = null;
  }

  getAccountTypeClass(accountType: string): string {
    switch (accountType) {
      case 'Ahorro':
        return 'type-ahorro';
      case 'Corriente':
        return 'type-corriente';
      case 'Credito':
        return 'type-credito';
      default:
        return '';
    }
  }

  getTotalBalance(): number {
    return this.filteredAccounts.reduce((total, account) => total + account.initialBalance, 0);
  }

  getActiveAccountsCount(): number {
    return this.filteredAccounts.filter(account => account.status).length;
  }

  trackByAccountId(index: number, account: Account): number {
    return account.id || index;
  }
}