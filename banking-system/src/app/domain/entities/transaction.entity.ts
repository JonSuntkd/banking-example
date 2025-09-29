export interface Transaction {
  id?: number;
  accountNumber: string;
  transactionType: 'Deposito' | 'Retiro';
  amount: number;
  date?: Date;
  balance?: number;
}

export interface TransactionReport {
  fecha: string;
  cliente: string;
  numeroCuenta: string;
  tipo: string;
  saldoInicial: number;
  estado: boolean;
  movimiento: number;
  saldoDisponible: number;
}