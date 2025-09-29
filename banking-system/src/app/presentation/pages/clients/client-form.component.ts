import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientUseCases } from '../../../application/use-cases/client.use-cases';
import { Client } from '../../../domain/entities/client.entity';
import { CreateClientRequest } from '../../../shared/types/api-types';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="d-flex justify-content-between align-items-center">
          <h2>{{ isEditMode ? 'Editar Cliente' : 'Nuevo Cliente' }}</h2>
          <a routerLink="/clients" class="btn btn-secondary">
            ← Volver a la lista
          </a>
        </div>
      </div>

      <div class="page-content">
        <form [formGroup]="clientForm" (ngSubmit)="onSubmit()">
          <div class="form-sections">
            <!-- Información Personal -->
            <div class="form-section">
              <h3 class="section-title">Información Personal</h3>
              
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label class="form-label" for="fullName">Nombre Completo *</label>
                  <input
                    type="text"
                    id="fullName"
                    class="form-control"
                    formControlName="fullName"
                    placeholder="Ingrese el nombre completo"
                    [class.is-invalid]="isFieldInvalid('fullName')">
                  <div *ngIf="isFieldInvalid('fullName')" class="invalid-feedback">
                    <div *ngIf="clientForm.get('fullName')?.errors?.['required']">
                      El nombre completo es requerido
                    </div>
                    <div *ngIf="clientForm.get('fullName')?.errors?.['minlength']">
                      El nombre debe tener al menos 2 caracteres
                    </div>
                  </div>
                </div>

                <div class="form-group col-md-6" *ngIf="isEditMode">
                  <label class="form-label" for="gender">Género</label>
                  <select id="gender" class="form-control" formControlName="gender">
                    <option value="">Seleccionar género</option>
                    <option value="HOMBRE">Hombre</option>
                    <option value="MUJER">Mujer</option>
                  </select>
                </div>
              </div>

              <div class="form-row" *ngIf="isEditMode">
                <div class="form-group col-md-6">
                  <label class="form-label" for="age">Edad</label>
                  <input
                    type="number"
                    id="age"
                    class="form-control"
                    formControlName="age"
                    placeholder="Ingrese la edad"
                    min="18"
                    max="120"
                    [class.is-invalid]="isFieldInvalid('age')">
                  <div *ngIf="isFieldInvalid('age')" class="invalid-feedback">
                    <div *ngIf="clientForm.get('age')?.errors?.['min']">
                      La edad mínima es 18 años
                    </div>
                    <div *ngIf="clientForm.get('age')?.errors?.['max']">
                      La edad máxima es 120 años
                    </div>
                  </div>
                </div>

                <div class="form-group col-md-6">
                  <label class="form-label" for="identification">Identificación</label>
                  <input
                    type="text"
                    id="identification"
                    class="form-control"
                    formControlName="identification"
                    placeholder="Ingrese el número de identificación"
                    [class.is-invalid]="isFieldInvalid('identification')">
                  <div *ngIf="isFieldInvalid('identification')" class="invalid-feedback">
                    <div *ngIf="clientForm.get('identification')?.errors?.['pattern']">
                      El número de identificación debe tener 10 dígitos
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Información de Contacto -->
            <div class="form-section">
              <h3 class="section-title">Información de Contacto</h3>
              
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label class="form-label" for="phone">Teléfono *</label>
                  <input
                    type="text"
                    id="phone"
                    class="form-control"
                    formControlName="phone"
                    placeholder="+593-99-123-4567"
                    [class.is-invalid]="isFieldInvalid('phone')">
                  <div *ngIf="isFieldInvalid('phone')" class="invalid-feedback">
                    <div *ngIf="clientForm.get('phone')?.errors?.['required']">
                      El teléfono es requerido
                    </div>
                    <div *ngIf="clientForm.get('phone')?.errors?.['pattern']">
                      El formato debe ser: +593-XX-XXX-XXXX
                    </div>
                  </div>
                </div>

                <div class="form-group col-md-6">
                  <label class="form-label" for="address">Dirección *</label>
                  <input
                    type="text"
                    id="address"
                    class="form-control"
                    formControlName="address"
                    placeholder="Ingrese la dirección completa"
                    [class.is-invalid]="isFieldInvalid('address')">
                  <div *ngIf="isFieldInvalid('address')" class="invalid-feedback">
                    <div *ngIf="clientForm.get('address')?.errors?.['required']">
                      La dirección es requerida
                    </div>
                    <div *ngIf="clientForm.get('address')?.errors?.['minlength']">
                      La dirección debe tener al menos 5 caracteres
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Información de Cuenta -->
            <div class="form-section">
              <h3 class="section-title">Información de Cuenta</h3>
              
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label class="form-label" for="password">Contraseña *</label>
                  <input
                    type="password"
                    id="password"
                    class="form-control"
                    formControlName="password"
                    placeholder="Ingrese la contraseña"
                    [class.is-invalid]="isFieldInvalid('password')">
                  <div *ngIf="isFieldInvalid('password')" class="invalid-feedback">
                    <div *ngIf="clientForm.get('password')?.errors?.['required']">
                      La contraseña es requerida
                    </div>
                    <div *ngIf="clientForm.get('password')?.errors?.['minlength']">
                      La contraseña debe tener al menos 6 caracteres
                    </div>
                  </div>
                </div>

                <div class="form-group col-md-6">
                  <label class="form-label">Estado</label>
                  <div class="form-check-container">
                    <label class="form-check">
                      <input
                        type="checkbox"
                        formControlName="status">
                      <span class="checkmark"></span>
                      Cliente activo
                    </label>
                  </div>
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
              [disabled]="clientForm.invalid || isLoading">
              <span *ngIf="isLoading" class="loading mr-2"></span>
              {{ isEditMode ? 'Actualizar' : 'Crear' }} Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  clientForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  error = '';
  clientId?: number;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly clientUseCases: ClientUseCases
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.clientId = parseInt(id, 10);
      this.loadClient(this.clientId);
    }
  }

  private initializeForm(): void {
    this.clientForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      gender: [''],
      age: ['', [Validators.min(18), Validators.max(120)]],
      identification: ['', [Validators.pattern(/^\d{10}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+593-\d{2}-\d{3}-\d{4}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      status: [true]
    });
  }

  private loadClient(id: number): void {
    this.isLoading = true;
    this.error = '';

    this.clientUseCases.getClientById(id).subscribe({
      next: (client: Client) => {
        this.clientForm.patchValue({
          fullName: client.person.fullName,
          gender: client.person.gender || '',
          age: client.person.age || '',
          identification: client.person.identification || '',
          phone: client.person.phone,
          address: client.person.address,
          password: client.password,
          status: client.status
        });
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = error.message;
        this.isLoading = false;
        console.error('Error loading client:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.error = '';

    const formValue = this.clientForm.value;

    if (this.isEditMode && this.clientId) {
      this.updateClient(formValue);
    } else {
      this.createClient(formValue);
    }
  }

  private createClient(formValue: any): void {
    const clientData: CreateClientRequest = {
      fullName: formValue.fullName,
      address: formValue.address,
      phone: formValue.phone,
      password: formValue.password,
      status: formValue.status
    };

    this.clientUseCases.createBasicClient(clientData).subscribe({
      next: () => {
        this.router.navigate(['/clients']);
      },
      error: (error: any) => {
        this.error = error.message;
        this.isLoading = false;
        console.error('Error creating client:', error);
      }
    });
  }

  private updateClient(formValue: any): void {
    const clientData: Client = {
      id: this.clientId,
      person: {
        fullName: formValue.fullName,
        gender: formValue.gender || undefined,
        age: formValue.age || undefined,
        identification: formValue.identification || undefined,
        address: formValue.address,
        phone: formValue.phone
      },
      password: formValue.password,
      status: formValue.status
    };

    this.clientUseCases.updateClient(this.clientId!, clientData).subscribe({
      next: () => {
        this.router.navigate(['/clients']);
      },
      error: (error: any) => {
        this.error = error.message;
        this.isLoading = false;
        console.error('Error updating client:', error);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/clients']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.clientForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  private markFormGroupTouched(): void {
    Object.keys(this.clientForm.controls).forEach(key => {
      const control = this.clientForm.get(key);
      control?.markAsTouched();
    });
  }
}