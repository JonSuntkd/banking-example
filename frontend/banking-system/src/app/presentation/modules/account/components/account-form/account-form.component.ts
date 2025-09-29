import { Component } from '@angular/core';

@Component({
  selector: 'app-account-form',
  template: `
    <div class="content-header">
      <h1 class="page-title">Nueva Cuenta</h1>
    </div>
    <div class="form-container">
      <p>Formulario de cuenta pendiente de implementar</p>
      <button class="btn btn-secondary" onclick="history.back()">Volver</button>
    </div>
  `,
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent {}