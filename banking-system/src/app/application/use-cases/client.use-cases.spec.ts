import { TestBed } from '@angular/core/testing';
import { ClientUseCases } from './client.use-cases';
import { ClientRepository } from '../../domain/repositories/client.repository';
import { Client } from '../../domain/entities/client.entity';
import { CreateClientRequest } from '../../shared/types/api-types';
import { of, throwError } from 'rxjs';

describe('ClientUseCases', () => {
  let service: ClientUseCases;
  let mockClientRepository: jasmine.SpyObj<ClientRepository>;

  const mockClient: Client = {
    id: 1,
    person: {
      fullName: 'Juan Pérez',
      address: 'Calle Principal 123',
      phone: '+593-99-123-4567'
    },
    password: 'password123',
    status: true
  };

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ClientRepository', [
      'getAll', 'getById', 'createBasic', 'update', 'activate', 'deactivate', 'delete'
    ]);

    TestBed.configureTestingModule({
      providers: [
        ClientUseCases,
        { provide: ClientRepository, useValue: spy }
      ]
    });

    service = TestBed.inject(ClientUseCases);
    mockClientRepository = TestBed.inject(ClientRepository) as jasmine.SpyObj<ClientRepository>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllClients', () => {
    it('should return all clients', () => {
      const clients: Client[] = [mockClient];
      mockClientRepository.getAll.and.returnValue(of(clients));

      service.getAllClients().subscribe(result => {
        expect(result).toEqual(clients);
      });

      expect(mockClientRepository.getAll).toHaveBeenCalled();
    });
  });

  describe('createBasicClient', () => {
    it('should create a client with valid data', () => {
      const clientData: CreateClientRequest = {
        fullName: 'Juan Pérez',
        address: 'Calle Principal 123',
        phone: '+593-99-123-4567',
        password: 'password123',
        status: true
      };

      mockClientRepository.createBasic.and.returnValue(of(mockClient));

      service.createBasicClient(clientData).subscribe(result => {
        expect(result).toEqual(mockClient);
      });

      expect(mockClientRepository.createBasic).toHaveBeenCalledWith(clientData);
    });

    it('should throw error for invalid phone format', () => {
      const clientData: CreateClientRequest = {
        fullName: 'Juan Pérez',
        address: 'Calle Principal 123',
        phone: 'invalid-phone',
        password: 'password123',
        status: true
      };

      expect(() => service.createBasicClient(clientData))
        .toThrow(new Error('El teléfono debe tener un formato válido (+593-XX-XXX-XXXX)'));
    });

    it('should throw error for short password', () => {
      const clientData: CreateClientRequest = {
        fullName: 'Juan Pérez',
        address: 'Calle Principal 123',
        phone: '+593-99-123-4567',
        password: '123',
        status: true
      };

      expect(() => service.createBasicClient(clientData))
        .toThrow(new Error('La contraseña debe tener al menos 6 caracteres'));
    });
  });

  describe('activateClient', () => {
    it('should activate a client', () => {
      mockClientRepository.activate.and.returnValue(of(undefined));

      service.activateClient(1).subscribe();

      expect(mockClientRepository.activate).toHaveBeenCalledWith(1);
    });
  });

  describe('deleteClient', () => {
    it('should delete a client', () => {
      mockClientRepository.delete.and.returnValue(of(undefined));

      service.deleteClient(1).subscribe();

      expect(mockClientRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});