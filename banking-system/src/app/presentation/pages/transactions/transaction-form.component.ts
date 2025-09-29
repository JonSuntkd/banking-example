import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TransactionUseCases } from '../../../application/use-cases/transaction.use-cases';
import { Transaction } from '../../../domain/entities/transaction.entity';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="d-flex justify-content-between align-items-center">
          <h2>{{ isEditMode ? 'Editar Transacción' : 'Nueva Transacción' }}</h2>
          <a routerLink="/transactions" class="btn btn-secondary">
            ← Volver a la lista
          </a>
        </div>
      </div>

      <div class="page-content">
        <form [formGroup]="transactionForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="accountNumber">Número de Cuenta *</label>
              <input type="text" id="accountNumber" class="form-control" formControlName="accountNumber" placeholder="Ingrese el número de cuenta">
            </div>
            <div class="form-group col-md-6">
              <label for="transactionType">Tipo de Transacción *</label>
              <select id="transactionType" class="form-control" formControlName="transactionType">
                <option value="">Seleccionar tipo</option>
                <option value="Deposito">Depósito</option>
                <option value="Retiro">Retiro</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="amount">Monto *</label>
              <input type="number" id="amount" class="form-control" formControlName="amount" placeholder="0.00" min="0" step="0.01">
            </div>
          </div>
          
          <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary mr-2" (click)="onCancel()">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="transactionForm.invalid || isLoading">
              <span *ngIf="isLoading" class="loading mr-2"></span>
              {{ isEditMode ? 'Actualizar' : 'Crear' }} Transacción
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-row { display: flex; flex-wrap: wrap; margin: 0 -0.75rem; }
    .form-group { margin-bottom: 1rem; padding: 0 0.75rem; }
    .col-md-6 { flex: 0 0 50%; max-width: 50%; }
    .form-actions { margin-top: 2rem; }
  `]
})
export class TransactionFormComponent implements OnInit {
  transactionForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  error = '';
  transactionId?: number;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly transactionUseCases: TransactionUseCases
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.transactionId = parseInt(id, 10);
      this.loadTransaction(this.transactionId);
    }
  }

  private initializeForm(): void {
    this.transactionForm = this.formBuilder.group({
      accountNumber: ['', [Validators.required]],
      transactionType: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0.01)]]
    });
  }

  private loadTransaction(id: number): void {
    this.isLoading = true;
    this.transactionUseCases.getTransactionById(id).subscribe({
      next: (transaction: Transaction) => {
        this.transactionForm.patchValue(transaction);
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = error.message;
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) return;

    this.isLoading = true;
    const formValue = this.transactionForm.value;

    if (this.isEditMode && this.transactionId) {
      this.transactionUseCases.updateTransaction(this.transactionId, formValue).subscribe({
        next: () => this.router.navigate(['/transactions']),
        error: (error: any) => {
          this.error = error.message;
          this.isLoading = false;
        }
      });
    } else {
      this.transactionUseCases.createTransaction(formValue).subscribe({
        next: () => this.router.navigate(['/transactions']),
        error: (error: any) => {
          this.error = error.message;
          this.isLoading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/transactions']);
  }
}