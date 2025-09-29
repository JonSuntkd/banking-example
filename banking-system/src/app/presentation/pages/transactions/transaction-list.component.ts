import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TransactionUseCases } from '../../../application/use-cases/transaction.use-cases';
import { Transaction } from '../../../domain/entities/transaction.entity';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="d-flex justify-content-between align-items-center">
          <h2>Gestión de Movimientos</h2>
          <a routerLink="/transactions/new" class="btn btn-primary">
            ➕ Nueva Transacción
          </a>
        </div>
      </div>

      <div class="page-content">
        <div *ngIf="isLoading" class="text-center">
          <div class="loading"></div>
          <p>Cargando transacciones...</p>
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
          <button class="btn btn-primary ml-2" (click)="loadTransactions()">
            Reintentar
          </button>
        </div>

        <div *ngIf="!isLoading && !error">
          <div *ngIf="transactions.length === 0" class="alert alert-warning">
            No hay transacciones registradas
          </div>

          <div *ngIf="transactions.length > 0" class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cuenta</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let transaction of transactions">
                  <td>{{ transaction.id }}</td>
                  <td class="account-number">{{ transaction.accountNumber }}</td>
                  <td>
                    <span [class]="getTransactionTypeClass(transaction.transactionType)">
                      {{ transaction.transactionType }}
                    </span>
                  </td>
                  <td [class]="getAmountClass(transaction.transactionType)">
                    ${{ transaction.amount | number:'1.2-2' }}
                  </td>
                  <td>{{ transaction.date | date:'short' }}</td>
                  <td>
                    <div class="action-buttons">
                      <a [routerLink]="['/transactions', transaction.id, 'edit']" class="btn btn-sm btn-warning mr-2">
                        ✏️
                      </a>
                      <button (click)="deleteTransaction(transaction.id!)" class="btn btn-sm btn-danger">
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
  `,
  styles: [`
    .account-number {
      font-family: 'Courier New', monospace;
      font-weight: 600;
    }
    .transaction-deposito {
      color: #28a745;
      font-weight: 600;
    }
    .transaction-retiro {
      color: #dc3545;
      font-weight: 600;
    }
    .amount-positive {
      color: #28a745;
      font-weight: 600;
    }
    .amount-negative {
      color: #dc3545;
      font-weight: 600;
    }
  `]
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  isLoading = false;
  error = '';

  constructor(private readonly transactionUseCases: TransactionUseCases) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.isLoading = true;
    this.error = '';

    this.transactionUseCases.getAllTransactions().subscribe({
      next: (transactions: Transaction[]) => {
        this.transactions = transactions;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }

  deleteTransaction(id: number): void {
    if (confirm('¿Está seguro de eliminar esta transacción?')) {
      this.transactionUseCases.deleteTransaction(id).subscribe({
        next: () => {
          this.loadTransactions();
        },
        error: (error: any) => {
          this.error = error.message;
        }
      });
    }
  }

  getTransactionTypeClass(type: string): string {
    return type === 'Deposito' ? 'transaction-deposito' : 'transaction-retiro';
  }

  getAmountClass(type: string): string {
    return type === 'Deposito' ? 'amount-positive' : 'amount-negative';
  }
}