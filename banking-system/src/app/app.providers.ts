import { Provider } from '@angular/core';
import { ClientRepository } from './domain/repositories/client.repository';
import { AccountRepository } from './domain/repositories/account.repository';
import { TransactionRepository } from './domain/repositories/transaction.repository';
import { ClientHttpService } from './infrastructure/repositories/client-http.service';
import { AccountHttpService } from './infrastructure/repositories/account-http.service';
import { TransactionHttpService } from './infrastructure/repositories/transaction-http.service';

export const APP_PROVIDERS: Provider[] = [
  { provide: ClientRepository, useClass: ClientHttpService },
  { provide: AccountRepository, useClass: AccountHttpService },
  { provide: TransactionRepository, useClass: TransactionHttpService }
];