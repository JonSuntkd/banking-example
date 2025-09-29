export interface Account {
  id?: number;
  accountNumber: string;
  accountType: 'Ahorro' | 'Corriente' | 'Credito';
  initialBalance: number;
  status: boolean;
  clientName?: string;
  clientId?: number;
}

export interface CreateAccountWithClient {
  accountNumber: string;
  accountType: 'Ahorro' | 'Corriente' | 'Credito';
  initialBalance: number;
  status: boolean;
  clientName: string;
}