import { ClientController } from '../../application/controllers/ClientController';
import { Client } from '../../domain/entities/Client';
import { IClientRepository } from '../../domain/repositories/IClientRepository';

describe('ClientController', () => {
  let mockRepository: jest.Mocked<IClientRepository>;
  let controller: ClientController;

  beforeEach(() => {
    mockRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      activate: jest.fn(),
      deactivate: jest.fn(),
    };
    controller = new ClientController(mockRepository);
  });

  describe('getAllClients', () => {
    it('should return all clients from repository', async () => {
      const mockClients: Client[] = [
        {
          id: 1,
          fullName: 'Test User',
          address: 'Test Address',
          phone: '123456789',
          password: 'password',
          status: true,
        },
      ];
      mockRepository.getAll.mockResolvedValue(mockClients);

      const result = await controller.getAllClients();
      expect(result).toEqual(mockClients);
      expect(mockRepository.getAll).toHaveBeenCalled();
    });
  });

  describe('createClient', () => {
    it('should create a new client', async () => {
      const newClient: Client = {
        fullName: 'New User',
        address: 'New Address',
        phone: '987654321',
        password: 'password',
        status: true,
      };
      const createdClient = { ...newClient, id: 1 };
      mockRepository.create.mockResolvedValue(createdClient);

      const result = await controller.createClient(newClient);
      expect(result).toEqual(createdClient);
      expect(mockRepository.create).toHaveBeenCalledWith(newClient);
    });
  });
});