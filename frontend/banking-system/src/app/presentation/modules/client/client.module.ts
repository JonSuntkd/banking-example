import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ClientListComponent } from './components/client-list/client-list.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { ClientUseCases } from '../../../application/use-cases/client-simple.use-cases';

const routes: Routes = [
  { path: '', component: ClientListComponent },
  { path: 'nuevo', component: ClientFormComponent },
  { path: 'editar/:id', component: ClientFormComponent }
];

@NgModule({
  declarations: [
    ClientListComponent,
    ClientFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    HttpClientModule
  ],
  providers: [
    ClientUseCases
  ]
})
export class ClientModule { }