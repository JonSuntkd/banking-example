import React, { useState, useEffect } from 'react';
import { Client } from '../../domain/entities/Client';
import { ClientController } from '../../application/controllers/ClientController';
import { ClientApiRepository } from '../../infrastructure/api/ClientApiRepository';
import '../styles/Views.css';
import '../styles/Table.css';

interface ClientFormProps {
  client: Client | null;
  onSubmit: (client: Client) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Client>({
    fullName: client?.person?.fullName || '',
    address: client?.person?.address || '',
    phone: client?.person?.phone || '',
    password: client?.password || '',
    status: client?.status ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Crear el objeto en el formato que espera la API
    const clientData: Client = {
      id: client?.id,
      person: {
        fullName: formData.fullName,
        address: formData.address,
        phone: formData.phone,
        gender: client?.person?.gender || '',
        age: client?.person?.age || 0,
        identification: client?.person?.identification || ''
      },
      password: formData.password,
      status: formData.status,
      fullName: formData.fullName, // Mantener para compatibilidad
      address: formData.address,
      phone: formData.phone
    };
    onSubmit(clientData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="fullName">Nombre completo:</label>
        <input
          id="fullName"
          type="text"
          className="form-control"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="address">Dirección:</label>
        <input
          id="address"
          type="text"
          className="form-control"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Teléfono:</label>
        <input
          id="phone"
          type="text"
          className="form-control"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña:</label>
        <input
          id="password"
          type="password"
          className="form-control"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {client ? 'Actualizar' : 'Crear'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

const ClientList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const controller = new ClientController(new ClientApiRepository());

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await controller.getAllClients();
      console.log('Datos recibidos de la API:', data);
      console.log('Tipo de datos:', typeof data);
      console.log('Es array:', Array.isArray(data));
      if (data.length > 0) {
        console.log('Primer elemento:', data[0]);
        console.log('Propiedades del primer elemento:', Object.keys(data[0]));
      }
      setClients(data);
      setError(null);
    } catch (error) {
      setError('Error al cargar los clientes. Por favor, intente nuevamente.');
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (client: Client) => {
    try {
      await controller.createClient(client);
      await loadClients();
      setIsModalOpen(false);
    } catch (error) {
      setError('Error al crear el cliente. Por favor, intente nuevamente.');
      console.error('Error creating client:', error);
    }
  };

  const handleUpdate = async (id: number, client: Client) => {
    try {
      await controller.updateClient(id, client);
      await loadClients();
      setIsModalOpen(false);
    } catch (error) {
      setError('Error al actualizar el cliente. Por favor, intente nuevamente.');
      console.error('Error updating client:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro que desea eliminar este cliente?')) {
      try {
        await controller.deleteClient(id);
        await loadClients();
        setError(null);
      } catch (error) {
        setError('Error al eliminar el cliente. Por favor, intente nuevamente.');
        console.error('Error deleting client:', error);
      }
    }
  };

  const handleStatusChange = async (id: number, currentStatus: boolean) => {
    try {
      if (currentStatus) {
        await controller.deactivateClient(id);
      } else {
        await controller.activateClient(id);
      }
      await loadClients();
      setError(null);
    } catch (error) {
      setError('Error al actualizar el estado del cliente. Por favor, intente nuevamente.');
      console.error('Error updating client status:', error);
    }
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h1>Lista de Clientes</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setSelectedClient(null);
            setIsModalOpen(true);
          }}
        >
          Nuevo Cliente
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.person?.fullName || 'N/A'}</td>
                <td>{client.person?.address || 'N/A'}</td>
                <td>{client.person?.phone || 'N/A'}</td>
                <td>
                  <span className={`status ${client.status ? 'active' : 'inactive'}`}>
                    {client.status ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => {
                      setSelectedClient(client);
                      setIsModalOpen(true);
                    }}
                    className="btn btn-secondary"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleStatusChange(client.id!, client.status)}
                    className={`btn ${client.status ? 'btn-warning' : 'btn-success'}`}
                  >
                    {client.status ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => handleDelete(client.id!)}
                    className="btn btn-danger"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
            <ClientForm
              client={selectedClient}
              onSubmit={(client) => {
                if (selectedClient) {
                  handleUpdate(selectedClient.id!, client);
                } else {
                  handleCreate(client);
                }
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;