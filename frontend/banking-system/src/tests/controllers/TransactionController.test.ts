import { TransactionController } from '../../application/controllers/TransactionController';
import { Transaction } from '../../domain/entities/Transaction';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';

describe('TransactionController', () => {
  let mockRepository: jest.Mocked<ITransactionRepository>;
  let controller: TransactionController;

  beforeEach(() => {
    mockRepository = {
      getAll: jest.fn(),
      create: jest.fn(),
      getReport: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    controller = new TransactionController(mockRepository);
  });

  describe('getAllTransactions', () => {
    it('should return all transactions from repository', async () => {
      const mockTransactions: Transaction[] = [
        {
          id: 1,
          accountNumber: '123456',
          transactionType: 'Deposito',
          amount: 1000,
          date: '2024-03-25',
          balance: 2000,
        },
      ];
      mockRepository.getAll.mockResolvedValue(mockTransactions);

      const result = await controller.getAllTransactions();
      expect(result).toEqual(mockTransactions);
      expect(mockRepository.getAll).toHaveBeenCalled();
    });
  });

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      const newTransaction: Transaction = {
        accountNumber: '123456',
        transactionType: 'Deposito',
        amount: 1000,
      };
      const createdTransaction = { ...newTransaction, id: 1, date: '2024-03-25', balance: 2000 };
      mockRepository.create.mockResolvedValue(createdTransaction);

      const result = await controller.createTransaction(newTransaction);
      expect(result).toEqual(createdTransaction);
      expect(mockRepository.create).toHaveBeenCalledWith(newTransaction);
    });
  });

  describe('getTransactionReport', () => {
    it('should return transactions report by date', async () => {
      const date = '2024-03-25';
      const mockTransactions: Transaction[] = [
        {
          id: 1,
          accountNumber: '123456',
          transactionType: 'Deposito',
          amount: 1000,
          date: '2024-03-25',
          balance: 2000,
        },
      ];
      mockRepository.getReport.mockResolvedValue(mockTransactions);

      const result = await controller.getTransactionReport(date);
      expect(result).toEqual(mockTransactions);
      expect(mockRepository.getReport).toHaveBeenCalledWith(date);
    });
  });
});