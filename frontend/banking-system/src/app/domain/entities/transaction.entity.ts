// Type alias for transaction types
export type TransactionType = 'Deposito' | 'Retiro';

// Domain Entity for Transaction
export interface Transaction {
  id?: number;
  accountNumber: string;
  transactionType: TransactionType;
  amount: number;
  date?: string; // ISO date string
  balance?: number; // Current balance after transaction
}

// DTO for transaction creation
export interface TransactionCreateDto {
  accountNumber: string;
  transactionType: TransactionType;
  amount: number;
}

// DTO for transaction update
export interface TransactionUpdateDto {
  accountNumber: string;
  transactionType: TransactionType;
  amount: number;
}

// DTO for transaction report
export interface TransactionReportDto {
  date: string; // Date in MM/d/yyyy format
  clientName?: string;
  accountNumber?: string;
  accountType?: string;
  initialBalance?: number;
  status?: boolean;
  transaction?: {
    amount: number;
    type: TransactionType;
    balance: number;
  };
}