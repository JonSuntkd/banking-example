import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Infrastructure providers
import { ClientRepository } from './domain/repositories/client.repository';
import { ClientHttpRepository } from './infrastructure/http/client-http.repository';
import { AccountRepository } from './domain/repositories/account.repository';
import { AccountHttpRepository } from './infrastructure/http/account-http.repository';
import { TransactionRepository } from './domain/repositories/transaction.repository';
import { TransactionHttpRepository } from './infrastructure/http/transaction-http.repository';

// Components
import { ClientListComponent } from './presentation/components/client/client-list/client-list.component';
import { ClientFormComponent } from './presentation/components/client/client-form/client-form.component';
import { AccountListComponent } from './presentation/components/account/account-list/account-list.component';
import { AccountFormComponent } from './presentation/components/account/account-form/account-form.component';
import { TransactionListComponent } from './presentation/components/transaction/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './presentation/components/transaction/transaction-form/transaction-form.component';
import { ReportComponent } from './presentation/components/report/report.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientListComponent,
    ClientFormComponent,
    AccountListComponent,
    AccountFormComponent,
    TransactionListComponent,
    TransactionFormComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    // Repository implementations following Dependency Injection principle
    { provide: ClientRepository, useClass: ClientHttpRepository },
    { provide: AccountRepository, useClass: AccountHttpRepository },
    { provide: TransactionRepository, useClass: TransactionHttpRepository }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }