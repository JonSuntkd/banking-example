import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionUseCases } from '../../../application/use-cases/transaction.use-cases';
import { PdfService } from '../../../infrastructure/services/pdf.service';
import { TransactionReport } from '../../../domain/entities/transaction.entity';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h2>📊 Reportes de Movimientos</h2>
      </div>

      <div class="page-content">
        <!-- Filtros -->
        <div class="filters-section">
          <div class="form-group">
            <label for="reportDate">Fecha del Reporte</label>
            <input 
              type="text" 
              id="reportDate" 
              class="form-control" 
              [(ngModel)]="reportDate"
              placeholder="DD/MM/YYYY (ej: 10/2/2022)"
              pattern="\\d{1,2}/\\d{1,2}/\\d{4}">
            <small class="form-text">Formato: DD/MM/YYYY</small>
          </div>
          <button 
            class="btn btn-primary"
            (click)="generateReport()"
            [disabled]="!reportDate || isLoading">
            <span *ngIf="isLoading" class="loading mr-2"></span>
            Generar Reporte
          </button>
        </div>

        <!-- Mensajes de estado -->
        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>

        <!-- Resultados del reporte -->
        <div *ngIf="reportData.length > 0 && !isLoading" class="report-section">
          <div class="report-header">
            <h3>Reporte de Movimientos - {{ reportDate }}</h3>
            <button class="btn btn-success" (click)="downloadPDF()">
              📄 Descargar PDF
            </button>
          </div>

          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Número Cuenta</th>
                  <th>Tipo</th>
                  <th>Saldo Inicial</th>
                  <th>Estado</th>
                  <th>Movimiento</th>
                  <th>Saldo Disponible</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let report of reportData">
                  <td>{{ report.fecha }}</td>
                  <td>{{ report.cliente }}</td>
                  <td class="account-number">{{ report.numeroCuenta }}</td>
                  <td>{{ report.tipo }}</td>
                  <td class="amount">{{ report.saldoInicial | currency:'USD':'symbol':'1.2-2' }}</td>
                  <td>
                    <span [class]="getStatusClass(report.estado)">
                      {{ report.estado ? 'Activa' : 'Inactiva' }}
                    </span>
                  </td>
                  <td [class]="getMovementClass(report.movimiento)">
                    {{ report.movimiento | currency:'USD':'symbol':'1.2-2' }}
                  </td>
                  <td class="amount-final">
                    {{ report.saldoDisponible | currency:'USD':'symbol':'1.2-2' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Resumen -->
          <div class="summary-section">
            <div class="summary-cards">
              <div class="summary-card">
                <div class="summary-value">{{ reportData.length }}</div>
                <div class="summary-label">Total Movimientos</div>
              </div>
              <div class="summary-card">
                <div class="summary-value">{{ getDepositsCount() }}</div>
                <div class="summary-label">Depósitos</div>
              </div>
              <div class="summary-card">
                <div class="summary-value">{{ getWithdrawalsCount() }}</div>
                <div class="summary-label">Retiros</div>
              </div>
              <div class="summary-card">
                <div class="summary-value">{{ getTotalMovements() | currency:'USD':'symbol':'1.2-2' }}</div>
                <div class="summary-label">Total Movido</div>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="reportData.length === 0 && !isLoading && !error && hasSearched" class="alert alert-warning">
          No se encontraron movimientos para la fecha seleccionada: {{ reportDate }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .filters-section {
      background-color: #f8f9fa;
      padding: 2rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      display: flex;
      gap: 2rem;
      align-items: end;
      flex-wrap: wrap;
    }
    .form-group {
      flex: 1;
      min-width: 200px;
    }
    .report-section {
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
    }
    .report-header {
      background-color: #f8f9fa;
      padding: 1.5rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #dee2e6;
    }
    .account-number {
      font-family: 'Courier New', monospace;
      font-weight: 600;
    }
    .amount, .amount-final {
      font-family: 'Courier New', monospace;
      font-weight: 600;
    }
    .movement-positive {
      color: #28a745;
      font-weight: 600;
    }
    .movement-negative {
      color: #dc3545;
      font-weight: 600;
    }
    .status-active {
      background-color: #d4edda;
      color: #155724;
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      font-size: 0.85rem;
    }
    .status-inactive {
      background-color: #f8d7da;
      color: #721c24;
      padding: 0.25rem 0.75rem;
      border-radius: 15px;
      font-size: 0.85rem;
    }
    .summary-section {
      padding: 2rem;
      border-top: 1px solid #dee2e6;
    }
    .summary-cards {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .summary-card {
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      flex: 1;
      min-width: 150px;
    }
    .summary-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #007bff;
      margin-bottom: 0.5rem;
    }
    .summary-label {
      font-size: 0.9rem;
      color: #6c757d;
      font-weight: 500;
    }
  `]
})
export class ReportsComponent implements OnInit {
  reportDate = '';
  reportData: TransactionReport[] = [];
  isLoading = false;
  error = '';
  hasSearched = false;

  constructor(
    private readonly transactionUseCases: TransactionUseCases,
    private readonly pdfService: PdfService
  ) {}

  ngOnInit(): void {
    // Set default date to current date in DD/MM/YYYY format
    const today = new Date();
    this.reportDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
  }

  generateReport(): void {
    if (!this.reportDate.trim()) {
      this.error = 'Por favor ingrese una fecha';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.hasSearched = true;

    this.transactionUseCases.getTransactionReport(this.reportDate).subscribe({
      next: (data: TransactionReport[]) => {
        this.reportData = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.error = error.message;
        this.reportData = [];
        this.isLoading = false;
      }
    });
  }

  downloadPDF(): void {
    if (this.reportData.length === 0) {
      this.error = 'No hay datos para generar el PDF';
      return;
    }

    try {
      this.pdfService.generateTransactionReport(this.reportData, this.reportDate);
    } catch (error) {
      this.error = 'Error al generar el PDF: ' + (error as Error).message;
    }
  }

  getStatusClass(status: boolean): string {
    return status ? 'status-active' : 'status-inactive';
  }

  getMovementClass(amount: number): string {
    return amount >= 0 ? 'movement-positive' : 'movement-negative';
  }

  getDepositsCount(): number {
    return this.reportData.filter(item => item.movimiento > 0).length;
  }

  getWithdrawalsCount(): number {
    return this.reportData.filter(item => item.movimiento < 0).length;
  }

  getTotalMovements(): number {
    return this.reportData.reduce((total, item) => total + Math.abs(item.movimiento), 0);
  }
}