// Type alias for account types
export type AccountType = 'Ahorro' | 'Corriente' | 'Credito';

// Domain Entity for Account
export interface Account {
  id?: number;
  accountNumber: string;
  accountType: AccountType;
  initialBalance: number;
  status: boolean;
  clientName?: string; // For optimized response format
}

// DTO for account creation with client
export interface AccountWithClientDto {
  accountNumber: string;
  accountType: AccountType;
  initialBalance: number;
  status: boolean;
  clientName: string;
}

// DTO for account update
export interface AccountUpdateDto {
  accountNumber: string;
  accountType: AccountType;
  initialBalance: number;
  status: boolean;
}