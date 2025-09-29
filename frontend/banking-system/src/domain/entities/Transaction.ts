export interface Transaction {
    id?: number;
    accountNumber: string;
    transactionType: string;
    amount: number;
    date?: string;
    balance?: number;
}