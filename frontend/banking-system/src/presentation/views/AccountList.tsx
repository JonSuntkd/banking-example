import React, { useState, useEffect } from 'react';
import { Account } from '../../domain/entities/Account';
import { AccountController } from '../../application/controllers/AccountController';
import { AccountApiRepository } from '../../infrastructure/api/AccountApiRepository';
import '../styles/Views.css';

const AccountList: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const controller = new AccountController(new AccountApiRepository());

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await controller.getAllAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const handleCreate = async (account: Account) => {
    try {
      await controller.createAccount(account);
      loadAccounts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleUpdate = async (id: number, account: Account) => {
    try {
      await controller.updateAccount(id, account);
      loadAccounts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await controller.deleteAccount(id);
      loadAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h1>Cuentas</h1>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setSelectedAccount(null);
            setIsModalOpen(true);
          }}
        >
          Nueva Cuenta
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Número de Cuenta</th>
            <th>Tipo</th>
            <th>Saldo Inicial</th>
            <th>Estado</th>
            <th>Cliente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.accountNumber}</td>
              <td>{account.accountType}</td>
              <td>${account.initialBalance.toFixed(2)}</td>
              <td>{account.status ? 'Activa' : 'Inactiva'}</td>
              <td>{account.clientName}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setSelectedAccount(account);
                    setIsModalOpen(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(account.id!)}
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
            <h2>{selectedAccount ? 'Editar Cuenta' : 'Nueva Cuenta'}</h2>
            <AccountForm
              account={selectedAccount}
              onSubmit={(account) => {
                if (selectedAccount) {
                  handleUpdate(selectedAccount.id!, account);
                } else {
                  handleCreate(account);
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

interface AccountFormProps {
  account?: Account | null;
  onSubmit: (account: Account) => void;
  onCancel: () => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ account, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Account>({
    accountNumber: account?.accountNumber || '',
    accountType: account?.accountType || '',
    initialBalance: account?.initialBalance || 0,
    status: account?.status ?? true,
    clientName: account?.clientName || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Número de Cuenta:</label>
        <input
          type="text"
          className="form-control"
          value={formData.accountNumber}
          onChange={(e) =>
            setFormData({ ...formData, accountNumber: e.target.value })
          }
          required
        />
      </div>
      <div className="form-group">
        <label>Tipo de Cuenta:</label>
        <select
          className="form-control"
          value={formData.accountType}
          onChange={(e) =>
            setFormData({ ...formData, accountType: e.target.value })
          }
          required
        >
          <option value="">Seleccionar tipo</option>
          <option value="Ahorro">Ahorro</option>
          <option value="Corriente">Corriente</option>
        </select>
      </div>
      <div className="form-group">
        <label>Saldo Inicial:</label>
        <input
          type="number"
          className="form-control"
          value={formData.initialBalance}
          onChange={(e) =>
            setFormData({
              ...formData,
              initialBalance: parseFloat(e.target.value),
            })
          }
          required
        />
      </div>
      <div className="form-group">
        <label>Nombre del Cliente:</label>
        <input
          type="text"
          className="form-control"
          value={formData.clientName}
          onChange={(e) =>
            setFormData({ ...formData, clientName: e.target.value })
          }
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {account ? 'Actualizar' : 'Crear'}
        </button>
        <button type="button" className="btn btn-danger" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default AccountList;