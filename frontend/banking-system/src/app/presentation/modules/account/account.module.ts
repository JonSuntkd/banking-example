import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AccountListComponent } from './components/account-list/account-list.component';
import { AccountFormComponent } from './components/account-form/account-form.component';

const routes: Routes = [
  { path: '', component: AccountListComponent },
  { path: 'nueva', component: AccountFormComponent },
  { path: 'editar/:id', component: AccountFormComponent }
];

@NgModule({
  declarations: [
    AccountListComponent,
    AccountFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AccountModule { }