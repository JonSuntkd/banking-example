import React, { useState, useEffect } from 'react';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionController } from '../../application/controllers/TransactionController';
import { TransactionApiRepository } from '../../infrastructure/api/TransactionApiRepository';
import '../styles/Views.css';

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const controller = new TransactionController(new TransactionApiRepository());

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await controller.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const handleCreate = async (transaction: Transaction) => {
    try {
      await controller.createTransaction(transaction);
      loadTransactions();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h1>Movimientos</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Nuevo Movimiento
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Número de Cuenta</th>
            <th>Tipo</th>
            <th>Monto</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.date}</td>
              <td>{transaction.accountNumber}</td>
              <td>{transaction.transactionType}</td>
              <td>${transaction.amount.toFixed(2)}</td>
              <td>${transaction.balance?.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Nuevo Movimiento</h2>
            <TransactionForm
              onSubmit={handleCreate}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
  onCancel: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Transaction>({
    accountNumber: '',
    transactionType: '',
    amount: 0,
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
        <label>Tipo de Movimiento:</label>
        <select
          className="form-control"
          value={formData.transactionType}
          onChange={(e) =>
            setFormData({ ...formData, transactionType: e.target.value })
          }
          required
        >
          <option value="">Seleccionar tipo</option>
          <option value="Deposito">Depósito</option>
          <option value="Retiro">Retiro</option>
        </select>
      </div>
      <div className="form-group">
        <label>Monto:</label>
        <input
          type="number"
          className="form-control"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: parseFloat(e.target.value) })
          }
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Crear
        </button>
        <button type="button" className="btn btn-danger" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default TransactionList;