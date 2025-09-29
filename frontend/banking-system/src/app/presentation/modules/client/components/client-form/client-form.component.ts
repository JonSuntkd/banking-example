import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ClientUseCases } from '@application/use-cases/client.use-cases';
import { Client, ClientBasicDto, ClientUpdateDto } from '@domain/entities/client.entity';

/**
 * Client Form Component for create and edit operations
 */
@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit, OnDestroy {
  clientForm: FormGroup;
  loading = false;
  error: string | null = null;
  isEditMode = false;
  clientId: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly clientUseCases: ClientUseCases,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.clientForm = this.createForm();
  }

  ngOnInit(): void {
    this.checkEditMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Create reactive form with validation
   */
  private createForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s\-()]+$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      status: [true],
      // Additional fields for full client profile
      gender: [''],
      age: ['', [Validators.min(18), Validators.max(120)]],
      identification: ['', [Validators.pattern(/^\d{10,13}$/)]]
    });
  }

  /**
   * Check if component is in edit mode
   */
  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.clientId = parseInt(id, 10);
      this.loadClientData();
    }
  }

  /**
   * Load client data for editing
   */
  private loadClientData(): void {
    if (!this.clientId) return;

    this.loading = true;
    this.clientUseCases.getClientById(this.clientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (client: Client) => {
          this.populateForm(client);
          this.loading = false;
        },
        error: (error: any) => {
          this.error = 'Error al cargar los datos del cliente: ' + error.message;
          this.loading = false;
        }
      });
  }

  /**
   * Populate form with client data
   */
  private populateForm(client: Client): void {
    this.clientForm.patchValue({
      fullName: client.person.fullName,
      address: client.person.address,
      phone: client.person.phone,
      password: client.password,
      status: client.status,
      gender: client.person.gender || '',
      age: client.person.age || '',
      identification: client.person.identification || ''
    });
  }

  /**
   * Submit form data
   */
  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    if (this.isEditMode) {
      this.updateClient();
    } else {
      this.createClient();
    }
  }

  /**
   * Create new client
   */
  private createClient(): void {
    const formValue = this.clientForm.value;
    const clientData: ClientBasicDto = {
      fullName: formValue.fullName,
      address: formValue.address,
      phone: formValue.phone,
      password: formValue.password,
      status: formValue.status
    };

    this.clientUseCases.createBasicClient(clientData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/clientes']);
        },
        error: (error: any) => {
          this.error = 'Error al crear el cliente: ' + error.message;
          this.loading = false;
        }
      });
  }

  /**
   * Update existing client
   */
  private updateClient(): void {
    if (!this.clientId) return;

    const formValue = this.clientForm.value;
    const clientData: ClientUpdateDto = {
      person: {
        fullName: formValue.fullName,
        address: formValue.address,
        phone: formValue.phone,
        gender: formValue.gender || undefined,
        age: formValue.age || undefined,
        identification: formValue.identification || undefined
      },
      password: formValue.password,
      status: formValue.status
    };

    this.clientUseCases.updateClient(this.clientId, clientData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['/clientes']);
        },
        error: (error: any) => {
          this.error = 'Error al actualizar el cliente: ' + error.message;
          this.loading = false;
        }
      });
  }

  /**
   * Cancel form and navigate back
   */
  onCancel(): void {
    this.router.navigate(['/clientes']);
  }

  /**
   * Mark all form controls as touched
   */
  private markFormGroupTouched(): void {
    Object.keys(this.clientForm.controls).forEach(key => {
      this.clientForm.get(key)?.markAsTouched();
    });
  }

  /**
   * Check if field has error
   */
  hasError(fieldName: string, errorType?: string): boolean {
    const field = this.clientForm.get(fieldName);
    if (!field) return false;

    if (errorType) {
      return field.hasError(errorType) && (field.dirty || field.touched);
    }
    
    return field.invalid && (field.dirty || field.touched);
  }

  /**
   * Get error message for field
   */
  getErrorMessage(fieldName: string): string {
    const field = this.clientForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;
    
    if (errors['required']) {
      return `${this.getFieldDisplayName(fieldName)} es requerido`;
    }
    
    if (errors['minlength']) {
      return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
    }
    
    if (errors['pattern']) {
      return `${this.getFieldDisplayName(fieldName)} tiene un formato inválido`;
    }
    
    if (errors['min']) {
      return `La edad mínima es ${errors['min'].min} años`;
    }
    
    if (errors['max']) {
      return `La edad máxima es ${errors['max'].max} años`;
    }

    return 'Campo inválido';
  }

  /**
   * Get display name for field
   */
  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      fullName: 'Nombre completo',
      address: 'Dirección',
      phone: 'Teléfono',
      password: 'Contraseña',
      gender: 'Género',
      age: 'Edad',
      identification: 'Identificación'
    };
    
    return fieldNames[fieldName] || fieldName;
  }
}