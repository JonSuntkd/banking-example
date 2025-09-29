import React, { useState } from 'react';
import { Button, Input, Select, Table, Modal, Column } from '../../components';
import { Client, ClientCreateRequest, ClientUpdateRequest, Person } from '../../../domain/entities/Client';
import { useClients } from '../../hooks/useClients';
import './ClientsPage.css';

const ClientsPage: React.FC = () => {
  const {
    clients,
    loading,
    error,
    createClient,
    updateClient,
    activateClient,
    deactivateClient,
    deleteClient,
  } = useClients();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Create client form state
  const [createForm, setCreateForm] = useState<ClientCreateRequest>({
    fullName: '',
    address: '',
    phone: '',
    password: '',
    status: true,
  });

  // Update client form state
  const [updateForm, setUpdateForm] = useState<{
    person: Person;
    password: string;
    status: boolean;
  }>({
    person: {
      fullName: '',
      gender: undefined,
      age: undefined,
      identification: '',
      address: '',
      phone: '',
    },
    password: '',
    status: true,
  });

  // Form validation
  const [createFormErrors, setCreateFormErrors] = useState<Record<string, string>>({});
  const [updateFormErrors, setUpdateFormErrors] = useState<Record<string, string>>({});

  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    (client.fullName || client.person?.fullName || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Handle create client
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateFormErrors({});

    try {
      await createClient(createForm);
      setIsCreateModalOpen(false);
      setCreateForm({
        fullName: '',
        address: '',
        phone: '',
        password: '',
        status: true,
      });
    } catch (err) {
      // Error will be handled by the hook
    }
  };

  // Handle update client
  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateFormErrors({});

    if (!selectedClient?.id) return;

    try {
      await updateClient(selectedClient.id, updateForm);
      setIsUpdateModalOpen(false);
      setSelectedClient(null);
    } catch (err) {
      // Error will be handled by the hook
    }
  };

  // Open update modal
  const openUpdateModal = (client: Client) => {
    setSelectedClient(client);
    setUpdateForm({
      person: {
        fullName: client.person?.fullName || client.fullName || '',
        gender: client.person?.gender,
        age: client.person?.age,
        identification: client.person?.identification || '',
        address: client.person?.address || client.address || '',
        phone: client.person?.phone || client.phone || '',
      },
      password: client.password,
      status: client.status,
    });
    setIsUpdateModalOpen(true);
  };

  // Handle client actions
  const handleActivate = async (client: Client) => {
    if (client.id) {
      await activateClient(client.id);
    }
  };

  const handleDeactivate = async (client: Client) => {
    if (client.id) {
      await deactivateClient(client.id);
    }
  };

  const handleDelete = async (client: Client) => {
    if (client.id && window.confirm('¿Está seguro de que desea eliminar este cliente?')) {
      await deleteClient(client.id);
    }
  };

  // Table columns
  const columns: Column<Client>[] = [
    {
      key: 'fullName',
      title: 'Nombre Completo',
      render: (_, record) => record.person?.fullName || record.fullName || '',
    },
    {
      key: 'address',
      title: 'Dirección',
      render: (_, record) => record.person?.address || record.address || '',
    },
    {
      key: 'phone',
      title: 'Teléfono',
      render: (_, record) => record.person?.phone || record.phone || '',
    },
    {
      key: 'status',
      title: 'Estado',
      align: 'center',
      render: (_, record) => (
        <span className={`status-badge ${record.status ? 'status-badge--active' : 'status-badge--inactive'}`}>
          {record.status ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Acciones',
      align: 'center',
      render: (_, record) => (
        <div className="action-buttons">
          <Button size="small" onClick={() => openUpdateModal(record)}>
            Editar
          </Button>
          {record.status ? (
            <Button
              size="small"
              variant="secondary"
              onClick={() => handleDeactivate(record)}
            >
              Desactivar
            </Button>
          ) : (
            <Button
              size="small"
              variant="success"
              onClick={() => handleActivate(record)}
            >
              Activar
            </Button>
          )}
          <Button
            size="small"
            variant="danger"
            onClick={() => handleDelete(record)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="clients-page">
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Nuevo
        </Button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="page-content">
        <div className="search-section">
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <Table
          columns={columns}
          data={filteredClients}
          loading={loading}
          emptyText="No hay clientes registrados"
        />
      </div>

      {/* Create Client Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Cliente"
      >
        <form onSubmit={handleCreateClient} className="client-form">
          <Input
            label="Nombre Completo"
            required
            value={createForm.fullName}
            onChange={(e) => setCreateForm({ ...createForm, fullName: e.target.value })}
            error={createFormErrors.fullName}
          />
          <Input
            label="Dirección"
            required
            value={createForm.address}
            onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
            error={createFormErrors.address}
          />
          <Input
            label="Teléfono"
            required
            value={createForm.phone}
            onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
            error={createFormErrors.phone}
          />
          <Input
            label="Contraseña"
            type="password"
            required
            value={createForm.password}
            onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
            error={createFormErrors.password}
          />
          <Select
            label="Estado"
            value={createForm.status.toString()}
            onChange={(e) => setCreateForm({ ...createForm, status: e.target.value === 'true' })}
            options={[
              { value: 'true', label: 'Activo' },
              { value: 'false', label: 'Inactivo' },
            ]}
          />
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={loading}>
              Crear Cliente
            </Button>
          </div>
        </form>
      </Modal>

      {/* Update Client Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Actualizar Cliente"
      >
        <form onSubmit={handleUpdateClient} className="client-form">
          <Input
            label="Nombre Completo"
            required
            value={updateForm.person.fullName}
            onChange={(e) => setUpdateForm({
              ...updateForm,
              person: { ...updateForm.person, fullName: e.target.value }
            })}
            error={updateFormErrors.fullName}
          />
          <Select
            label="Género"
            value={updateForm.person.gender || ''}
            onChange={(e) => setUpdateForm({
              ...updateForm,
              person: { ...updateForm.person, gender: e.target.value as 'HOMBRE' | 'MUJER' }
            })}
            options={[
              { value: '', label: 'Seleccione género' },
              { value: 'HOMBRE', label: 'Hombre' },
              { value: 'MUJER', label: 'Mujer' },
            ]}
          />
          <Input
            label="Edad"
            type="number"
            value={updateForm.person.age?.toString() || ''}
            onChange={(e) => setUpdateForm({
              ...updateForm,
              person: { ...updateForm.person, age: e.target.value ? parseInt(e.target.value) : undefined }
            })}
          />
          <Input
            label="Identificación"
            value={updateForm.person.identification}
            onChange={(e) => setUpdateForm({
              ...updateForm,
              person: { ...updateForm.person, identification: e.target.value }
            })}
          />
          <Input
            label="Dirección"
            required
            value={updateForm.person.address}
            onChange={(e) => setUpdateForm({
              ...updateForm,
              person: { ...updateForm.person, address: e.target.value }
            })}
            error={updateFormErrors.address}
          />
          <Input
            label="Teléfono"
            required
            value={updateForm.person.phone}
            onChange={(e) => setUpdateForm({
              ...updateForm,
              person: { ...updateForm.person, phone: e.target.value }
            })}
            error={updateFormErrors.phone}
          />
          <Input
            label="Contraseña"
            type="password"
            required
            value={updateForm.password}
            onChange={(e) => setUpdateForm({ ...updateForm, password: e.target.value })}
            error={updateFormErrors.password}
          />
          <Select
            label="Estado"
            value={updateForm.status.toString()}
            onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value === 'true' })}
            options={[
              { value: 'true', label: 'Activo' },
              { value: 'false', label: 'Inactivo' },
            ]}
          />
          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={() => setIsUpdateModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={loading}>
              Actualizar Cliente
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClientsPage;