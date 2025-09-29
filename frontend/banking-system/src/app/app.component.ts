import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">B</div>
          BANCO
        </div>
      </div>
    </header>

    <div class="main-container">
      <nav class="sidebar">
        <ul class="nav-menu">
          <li class="nav-item">
            <a routerLink="/clientes" routerLinkActive="active" class="nav-link">
              Clientes
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/cuentas" routerLinkActive="active" class="nav-link">
              Cuentas
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/movimientos" routerLinkActive="active" class="nav-link">
              Movimientos
            </a>
          </li>
          <li class="nav-item">
            <a routerLink="/reportes" routerLinkActive="active" class="nav-link">
              Reportes
            </a>
          </li>
        </ul>
      </nav>

      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Banking System';
}