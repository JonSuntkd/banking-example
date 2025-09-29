import React, { useState } from 'react';
import { Transaction } from '../../domain/entities/Transaction';
import { TransactionController } from '../../application/controllers/TransactionController';
import { TransactionApiRepository } from '../../infrastructure/api/TransactionApiRepository';
import { jsPDF } from 'jspdf';
import '../styles/Views.css';

const TransactionReport: React.FC = () => {
  const [date, setDate] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const controller = new TransactionController(new TransactionApiRepository());

  const handleSearch = async () => {
    try {
      const data = await controller.getTransactionReport(date);
      setTransactions(data);
    } catch (error) {
      console.error('Error getting report:', error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Reporte de Movimientos', 20, 20);
    
    // Add date
    doc.setFontSize(12);
    doc.text(`Fecha: ${date}`, 20, 30);
    
    // Add table headers
    doc.text('Fecha', 20, 40);
    doc.text('Cuenta', 60, 40);
    doc.text('Tipo', 100, 40);
    doc.text('Monto', 140, 40);
    doc.text('Saldo', 180, 40);
    
    // Add table content
    let y = 50;
    transactions.forEach((transaction) => {
      doc.text(transaction.date || '', 20, y);
      doc.text(transaction.accountNumber, 60, y);
      doc.text(transaction.transactionType, 100, y);
      doc.text(`$${transaction.amount.toFixed(2)}`, 140, y);
      doc.text(`$${transaction.balance?.toFixed(2) || '0.00'}`, 180, y);
      y += 10;
    });
    
    // Save the PDF
    doc.save('reporte-movimientos.pdf');
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h1>Reporte de Movimientos</h1>
      </div>

      <div className="card">
        <div className="form-group">
          <label>Fecha:</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSearch}>
          Buscar
        </button>
      </div>

      {transactions.length > 0 && (
        <>
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
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.date}</td>
                  <td>{transaction.accountNumber}</td>
                  <td>{transaction.transactionType}</td>
                  <td>${transaction.amount.toFixed(2)}</td>
                  <td>${transaction.balance?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="btn btn-success" onClick={handleDownloadPDF}>
            Descargar PDF
          </button>
        </>
      )}
    </div>
  );
};

export default TransactionReport;