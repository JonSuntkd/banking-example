import React, { useState, useEffect, FormEvent } from 'react';
import { Client } from '../../domain/entities/Client';
import { ClientController } from '../../application/controllers/ClientController';
import { ClientApiRepository } from '../../infrastructure/api/ClientApiRepository';
import '../styles/Views.css';
import '../styles/Table.css';

interface ClientFormProps {
  client: Client | null;
  onSuinterface ClientFormProps {
  client: Client | null;
  onSubmit: (client: Client) => void;
  onCancel: () => void;
}

const ClientForm = ({ client, onSubmit, onCancel }: ClientFormProps) => {client: Client) => void;
  onCancel: () => void;
}

const ClientForm = ({ client, onSubmit, onCancel }: ClientFormProps) => {
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
                <td>{client.fullName}</td>
                <td>{client.address}</td>
                <td>{client.phone}</td>
                <td>
                  <span className={`status ${client.status ? 'active' : 'inactive'}`}>
                    {client.status ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleStatusChange(client.id!, client.status)}
                    className={client.status ? 'deactivate-btn' : 'activate-btn'}
                  >
                    {client.status ? 'Desactivar' : 'Activar'}
                  </button>
                  <button
                    onClick={() => handleDelete(client.id!)}
                    className="delete-btn"
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

const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Client>({
    fullName: client?.fullName || '',
    address: client?.address || '',
    phone: client?.phone || '',
    password: client?.password || '',
    status: client?.status ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nombre completo:</label>
        <input
          type="text"
          className="form-control"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Dirección:</label>
        <input
          type="text"
          className="form-control"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Teléfono:</label>
        <input
          type="text"
          className="form-control"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Contraseña:</label>
        <input
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
      setClients(data);
      setError(null);
    } catch (error) {
      setError('Error loading clients. Please try again later.');
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (client: Client) => {
    try {
      await controller.createClient(client);
      loadClients();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  const handleUpdate = async (id: number, client: Client) => {
    try {
      await controller.updateClient(id, client);
      loadClients();
      setIsModalOpen(false);
    } catch (error) {
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

  const handleActivate = async (id: number) => {
    try {
      await controller.activateClient(id);
      loadClients();
    } catch (error) {
      console.error('Error activating client:', error);
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await controller.deactivateClient(id);
      loadClients();
    } catch (error) {
      console.error('Error deactivating client:', error);
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
      <h1>Lista de Clientes</h1>

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
              <td>{client.fullName}</td>
              <td>{client.address}</td>
              <td>{client.phone}</td>
              <td>
                <span className={`status ${client.status ? 'active' : 'inactive'}`}>
                  {client.status ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleStatusChange(client.id!, client.status)}
                  className={client.status ? 'deactivate-btn' : 'activate-btn'}
                >
                  {client.status ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => handleDelete(client.id!)}
                  className="delete-btn"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

interface ClientFormProps {
  client?: Client | null;
  onSubmit: (client: Client) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Client>({
    fullName: client?.fullName || '',
    address: client?.address || '',
    phone: client?.phone || '',
    password: client?.password || '',
    status: client?.status ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nombre completo:</label>
        <input
          type="text"
          className="form-control"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          required
        />
      </div>
      <div className="form-group">
        <label>Dirección:</label>
        <input
          type="text"
          className="form-control"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          required
        />
      </div>
      <div className="form-group">
        <label>Teléfono:</label>
        <input
          type="text"
          className="form-control"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          required
        />
      </div>
      <div className="form-group">
        <label>Contraseña:</label>
        <input
          type="password"
          className="form-control"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {client ? 'Actualizar' : 'Crear'}
        </button>
        <button type="button" className="btn btn-danger" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ClientList;