import { Component } from '@angular/core';

@Component({
  selector: 'app-account-list',
  template: `
    <div class="content-header">
      <h1 class="page-title">Cuentas</h1>
    </div>
    <div class="action-bar">
      <div class="search-container">
        <input type="text" class="search-input" placeholder="Buscar">
      </div>
      <button class="btn btn-primary">Nueva</button>
    </div>
    <div class="data-table">
      <table class="table">
        <thead>
          <tr>
            <th>Número de Cuenta</th>
            <th>Tipo</th>
            <th>Saldo</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="6" class="text-center">
              <em>Funcionalidad pendiente de implementar</em>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent {}