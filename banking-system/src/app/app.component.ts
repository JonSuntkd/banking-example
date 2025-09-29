import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="app-layout">
      <header class="app-header">
        <div class="header-content">
          <div class="logo">
            <h1>🏦 BANCO</h1>
          </div>
          <nav class="header-nav">
            <span class="user-info">Sistema Bancario v1.0</span>
          </nav>
        </div>
      </header>

      <div class="app-body">
        <aside class="sidebar">
          <nav class="sidebar-nav">
            <ul class="nav-list">
              <li class="nav-item">
                <a routerLink="/clients" routerLinkActive="active" class="nav-link">
                  <span class="nav-icon">👥</span>
                  <span class="nav-text">Clientes</span>
                </a>
              </li>
              <li class="nav-item">
                <a routerLink="/accounts" routerLinkActive="active" class="nav-link">
                  <span class="nav-icon">🏦</span>
                  <span class="nav-text">Cuentas</span>
                </a>
              </li>
              <li class="nav-item">
                <a routerLink="/transactions" routerLinkActive="active" class="nav-link">
                  <span class="nav-icon">💰</span>
                  <span class="nav-text">Movimientos</span>
                </a>
              </li>
              <li class="nav-item">
                <a routerLink="/reports" routerLinkActive="active" class="nav-link">
                  <span class="nav-icon">📊</span>
                  <span class="nav-text">Reportes</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'banking-system';
}