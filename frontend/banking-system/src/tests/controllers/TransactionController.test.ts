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
      getReportByClientAndDateRange: jest.fn(),
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

  describe('getTransactionReportByClientAndDateRange', () => {
    it('should return transactions report by client and date range', async () => {
      const startDate = '2024-03-01';
      const endDate = '2024-03-31';
      const clientName = 'Jose Lema';
      const mockReportResponse = {
        reportData: [
          {
            fecha: '28/09/2025',
            cliente: 'Jose Lema',
            numeroCuenta: '478758',
            tipo: 'Ahorro',
            saldoInicial: 1375.00,
            estado: true,
            movimiento: 575.00,
            saldoDisponible: 1425.00,
          },
        ],
        pdfBase64: 'base64EncodedPDFString',
      };
      mockRepository.getReportByClientAndDateRange.mockResolvedValue(mockReportResponse);

      const result = await controller.getTransactionReportByClientAndDateRange(startDate, endDate, clientName);
      expect(result).toEqual(mockReportResponse);
      expect(mockRepository.getReportByClientAndDateRange).toHaveBeenCalledWith(startDate, endDate, clientName);
    });

    it('should handle empty report data', async () => {
      const startDate = '2024-03-01';
      const endDate = '2024-03-31';
      const clientName = 'Cliente Inexistente';
      const mockReportResponse = {
        reportData: [],
        pdfBase64: '',
      };
      mockRepository.getReportByClientAndDateRange.mockResolvedValue(mockReportResponse);

      const result = await controller.getTransactionReportByClientAndDateRange(startDate, endDate, clientName);
      expect(result).toEqual(mockReportResponse);
      expect(result.reportData).toHaveLength(0);
      expect(result.pdfBase64).toBe('');
    });

    it('should handle repository errors', async () => {
      const startDate = '2024-03-01';
      const endDate = '2024-03-31';
      const clientName = 'Jose Lema';
      const errorMessage = 'Database connection failed';
      mockRepository.getReportByClientAndDateRange.mockRejectedValue(new Error(errorMessage));

      await expect(controller.getTransactionReportByClientAndDateRange(startDate, endDate, clientName))
        .rejects.toThrow(errorMessage);
    });

    it('should handle invalid date ranges', async () => {
      const startDate = '2024-03-31';
      const endDate = '2024-03-01'; // Fecha de fin antes que inicio
      const clientName = 'Jose Lema';
      
      // El repositorio debería manejar esto, pero podríamos añadir validación
      mockRepository.getReportByClientAndDateRange.mockResolvedValue({
        reportData: [],
        pdfBase64: '',
      });

      const result = await controller.getTransactionReportByClientAndDateRange(startDate, endDate, clientName);
      expect(mockRepository.getReportByClientAndDateRange).toHaveBeenCalledWith(startDate, endDate, clientName);
    });
  });
});