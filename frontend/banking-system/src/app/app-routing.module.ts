import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  {
    path: 'clientes',
    loadChildren: () => import('./presentation/modules/client/client.module').then(m => m.ClientModule)
  },
  {
    path: 'cuentas',
    loadChildren: () => import('./presentation/modules/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'movimientos',
    loadChildren: () => import('./presentation/modules/transaction/transaction.module').then(m => m.TransactionModule)
  },
  {
    path: 'reportes',
    loadChildren: () => import('./presentation/modules/report/report.module').then(m => m.ReportModule)
  },
  { path: '**', redirectTo: '/clientes' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }