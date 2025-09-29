import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AccountUseCases } from '../../../application/use-cases/account.use-cases';
import { Account, CreateAccountWithClient } from '../../../domain/entities/account.entity';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="d-flex justify-content-between align-items-center">
          <h2>{{ isEditMode ? 'Editar Cuenta' : 'Nueva Cuenta' }}</h2>
          <a routerLink="/accounts" class="btn btn-secondary">
            ← Volver a la lista
          </a>
        </div>
      </div>

      <div class="page-content">
        <form [formGroup]="accountForm" (ngSubmit)="onSubmit()">
          <div class="form-sections">
            <!-- Información de la Cuenta -->
            <div class="form-section">
              <h3 class="section-title">Información de la Cuenta</h3>
              
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label class="form-label" for="accountNumber">Número de Cuenta *</label>
                  <input
                    type="text"
                    id="accountNumber"
                    class="form-control"
                    formControlName="accountNumber"
                    placeholder="Ingrese el número de cuenta"
                    [class.is-invalid]="isFieldInvalid('accountNumber')">
                  <div *ngIf="isFieldInvalid('accountNumber')" class="invalid-feedback">
                    <div *ngIf="accountForm.get('accountNumber')?.errors?.['required']">
                      El número de cuenta es requerido
                    </div>
                    <div *ngIf="accountForm.get('accountNumber')?.errors?.['minlength']">
                      El número de cuenta debe tener al menos 4 dígitos
                    </div>
                    <div *ngIf="accountForm.get('accountNumber')?.errors?.['pattern']">
                      El número de cuenta solo debe contener números
                    </div>
                  </div>
                </div>

                <div class="form-group col-md-6">
                  <label class="form-label" for="accountType">Tipo de Cuenta *</label>
                  <select 
                    id="accountType" 
                    class="form-control" 
                    formControlName="accountType"
                    [class.is-invalid]="isFieldInvalid('accountType')">
                    <option value="">Seleccionar tipo</option>
                    <option value="Ahorro">Cuenta de Ahorro</option>
                    <option value="Corriente">Cuenta Corriente</option>
                    <option value="Credito">Cuenta de Crédito</option>
                  </select>
                  <div *ngIf="isFieldInvalid('accountType')" class="invalid-feedback">
                    <div *ngIf="accountForm.get('accountType')?.errors?.['required']">
                      El tipo de cuenta es requerido
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-md-6">
                  <label class="form-label" for="initialBalance">Saldo Inicial *</label>
                  <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input
                      type="number"
                      id="initialBalance"
                      class="form-control"
                      formControlName="initialBalance"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      [class.is-invalid]="isFieldInvalid('initialBalance')">
                  </div>
                  <div *ngIf="isFieldInvalid('initialBalance')" class="invalid-feedback">
                    <div *ngIf="accountForm.get('initialBalance')?.errors?.['required']">
                      El saldo inicial es requerido
                    </div>
                    <div *ngIf="accountForm.get('initialBalance')?.errors?.['min']">
                      El saldo inicial no puede ser negativo
                    </div>
                  </div>
                </div>

                <div class="form-group col-md-6">
                  <label class="form-label">Estado de la Cuenta</label>
                  <div class="form-check-container">
                    <label class="form-check">
                      <input
                        type="checkbox"
                        formControlName="status">
                      <span class="checkmark"></span>
                      Cuenta activa
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Información del Cliente -->
            <div class="form-section" *ngIf="!isEditMode">
              <h3 class="section-title">Cliente Asociado</h3>
              
              <div class="form-row">
                <div class="form-group col-md-12">
                  <label class="form-label" for="clientName">Nombre del Cliente *</label>
                  <input
                    type="text"
                    id="clientName"
                    class="form-control"
                    formControlName="clientName"
                    placeholder="Ingrese el nombre completo del cliente"
                    [class.is-invalid]="isFieldInvalid('clientName')">
                  <div *ngIf="isFieldInvalid('clientName')" class="invalid-feedback">
                    <div *ngIf="accountForm.get('clientName')?.errors?.['required']">
                      El nombre del cliente es requerido
                    </div>
                    <div *ngIf="accountForm.get('clientName')?.errors?.['minlength']">
                      El nombre debe tener al menos 2 caracteres
                    </div>
                  </div>
                  <small class="form-text">
                    Debe coincidir exactamente con el nombre registrado en el sistema de clientes.
                  </small>
                </div>
              </div>
            </div>

            <!-- Información del Cliente (Solo lectura en edición) -->
            <div class="form-section" *ngIf="isEditMode && currentAccount?.clientName">
              <h3 class="section-title">Cliente Asociado</h3>
              
              <div class="client-info-readonly">
                <div class="info-item">
                  <label class="info-label">Cliente:</label>
                  <span class="info-value">{{ currentAccount.clientName }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Mensajes de error -->
          <div *ngIf="error" class="alert alert-danger">
            {{ error }}
          </div>

          <!-- Botones de acción -->
          <div class="form-actions">
            <button
              type="button"
              class="btn btn-secondary mr-2"
              (click)="onCancel()"
              [disabled]="isLoading">
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="accountForm.invalid || isLoading">
              <span *ngIf="isLoading" class="loading mr-2"></span>
              {{ isEditMode ? 'Actualizar' : 'Crear' }} Cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {
  accountForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  error = '';
  accountId?: number;
  currentAccount?: Account;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly accountUseCases: AccountUseCases
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.accountId = parseInt(id, 10);
      this.loadAccount(this.accountId);
    }
  }

  private initializeForm(): void {
    this.accountForm = this.formBuilder.group({
      accountNumber: ['', [
        Validators.required, 
        Validators.minLength(4),
        Validators.pattern(/^\d+$/)
      ]],
      accountType: ['', [Validators.required]],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
      status: [true],
      clientName: ['', [Validators.required, Validators.minLength(2)]]
    });

    // Si es modo edición, el nombre del cliente no es requerido
    if (this.isEditMode) {
      this.accountForm.get('clientName')?.clearValidators();
      this.accountForm.get('clientName')?.updateValueAndValidity();
    }
  }

  private loadAccount(id: number): void {
    this.isLoading = true;
    this.error = '';

    this.accountUseCases.getAccountById(id).subscribe({
      next: (account: Account) => {
        this.currentAccount = account;
        this.accountForm.patchValue({
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          initialBalance: account.initialBalance,
          status: account.status
        });
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = error.message;
        this.isLoading = false;
        console.error('Error loading account:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.accountForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.error = '';

    const formValue = this.accountForm.value;

    if (this.isEditMode && this.accountId) {
      this.updateAccount(formValue);
    } else {
      this.createAccount(formValue);
    }
  }

  private createAccount(formValue: any): void {
    const accountData: CreateAccountWithClient = {
      accountNumber: formValue.accountNumber,
      accountType: formValue.accountType,
      initialBalance: formValue.initialBalance,
      status: formValue.status,
      clientName: formValue.clientName
    };

    this.accountUseCases.createAccountWithClient(accountData).subscribe({
      next: () => {
        this.router.navigate(['/accounts']);
      },
      error: (error: any) => {
        this.error = error.message;
        this.isLoading = false;
        console.error('Error creating account:', error);
      }
    });
  }

  private updateAccount(formValue: any): void {
    const accountData: Account = {
      id: this.accountId,
      accountNumber: formValue.accountNumber,
      accountType: formValue.accountType,
      initialBalance: formValue.initialBalance,
      status: formValue.status,
      clientName: this.currentAccount?.clientName
    };

    this.accountUseCases.updateAccount(this.accountId!, accountData).subscribe({
      next: () => {
        this.router.navigate(['/accounts']);
      },
      error: (error: any) => {
        this.error = error.message;
        this.isLoading = false;
        console.error('Error updating account:', error);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/accounts']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.accountForm.get(fieldName);
    return field?.invalid && (field.dirty || field.touched) || false;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.accountForm.controls).forEach(key => {
      const control = this.accountForm.get(key);
      control?.markAsTouched();
    });
  }
}