import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/clients', pathMatch: 'full' },
  { 
    path: 'clients', 
    loadComponent: () => import('./presentation/pages/clients/client-list.component')
      .then(m => m.ClientListComponent)
  },
  { 
    path: 'clients/new', 
    loadComponent: () => import('./presentation/pages/clients/client-form.component')
      .then(m => m.ClientFormComponent)
  },
  { 
    path: 'clients/:id/edit', 
    loadComponent: () => import('./presentation/pages/clients/client-form.component')
      .then(m => m.ClientFormComponent)
  },
  { 
    path: 'accounts', 
    loadComponent: () => import('./presentation/pages/accounts/account-list.component')
      .then(m => m.AccountListComponent)
  },
  { 
    path: 'accounts/new', 
    loadComponent: () => import('./presentation/pages/accounts/account-form.component')
      .then(m => m.AccountFormComponent)
  },
  { 
    path: 'accounts/:id/edit', 
    loadComponent: () => import('./presentation/pages/accounts/account-form.component')
      .then(m => m.AccountFormComponent)
  },
  { 
    path: 'transactions', 
    loadComponent: () => import('./presentation/pages/transactions/transaction-list.component')
      .then(m => m.TransactionListComponent)
  },
  { 
    path: 'transactions/new', 
    loadComponent: () => import('./presentation/pages/transactions/transaction-form.component')
      .then(m => m.TransactionFormComponent)
  },
  { 
    path: 'transactions/:id/edit', 
    loadComponent: () => import('./presentation/pages/transactions/transaction-form.component')
      .then(m => m.TransactionFormComponent)
  },
  { 
    path: 'reports', 
    loadComponent: () => import('./presentation/pages/reports/reports.component')
      .then(m => m.ReportsComponent)
  },
  { path: '**', redirectTo: '/clients' }
];