import { AccountController } from '../../application/controllers/AccountController';
import { Account } from '../../domain/entities/Account';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';

describe('AccountController', () => {
  let mockRepository: jest.Mocked<IAccountRepository>;
  let controller: AccountController;

  beforeEach(() => {
    mockRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    controller = new AccountController(mockRepository);
  });

  describe('getAllAccounts', () => {
    it('should return all accounts from repository', async () => {
      const mockAccounts: Account[] = [
        {
          id: 1,
          accountNumber: '123456',
          accountType: 'Ahorro',
          initialBalance: 1000,
          status: true,
          clientName: 'Test User',
        },
      ];
      mockRepository.getAll.mockResolvedValue(mockAccounts);

      const result = await controller.getAllAccounts();
      expect(result).toEqual(mockAccounts);
      expect(mockRepository.getAll).toHaveBeenCalled();
    });
  });

  describe('createAccount', () => {
    it('should create a new account', async () => {
      const newAccount: Account = {
        accountNumber: '123456',
        accountType: 'Ahorro',
        initialBalance: 1000,
        status: true,
        clientName: 'Test User',
      };
      const createdAccount = { ...newAccount, id: 1 };
      mockRepository.create.mockResolvedValue(createdAccount);

      const result = await controller.createAccount(newAccount);
      expect(result).toEqual(createdAccount);
      expect(mockRepository.create).toHaveBeenCalledWith(newAccount);
    });
  });
});