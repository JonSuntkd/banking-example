import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Views.css';

interface ReportData {
  id: number;
  accountNumber: string;
  transactionType: string;
  amount: number;
  date: string;
  clientName: string;
  balance: number;
}

interface ReportResponse {
  reportData: ReportData[];
  pdfBase64: string;
}

const TransactionReport: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);



  const handleGenerateReport = async () => {
    if (!startDate || !endDate || !clientName.trim()) {
      setError('Por favor complete todos los campos: fecha de inicio, fecha de fin y nombre del cliente');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('La fecha de inicio no puede ser mayor que la fecha de fin');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setShowResults(false);
      
      const reportUrl = `/transaction/reports-report?startDate=${startDate}&endDate=${endDate}&clientName=${encodeURIComponent(clientName)}`;
      
      console.log('Haciendo petición a:', reportUrl);
      console.log('Parámetros:', { startDate, endDate, clientName });
      
      const response = await axios.get<ReportResponse>(reportUrl);
      
      console.log('Respuesta recibida:', response.data);
      
      if (response.data && response.data.reportData && response.data.reportData.length > 0) {
        setReportData(response.data.reportData);
        setPdfBase64(response.data.pdfBase64);
        setShowResults(true);
        setError('✅ Reporte generado exitosamente');
      } else {
        setReportData([]);
        setPdfBase64('');
        setShowResults(false);
        setError('❌ No se encontraron movimientos para el cliente y fechas especificadas');
      }
      
    } catch (error) {
      console.error('Error generating report:', error);
      setReportData([]);
      setPdfBase64('');
      setShowResults(false);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setError('❌ No se encontraron movimientos para el cliente y fechas especificadas');
        } else if (error.response && error.response.status >= 500) {
          setError('❌ Error del servidor. Por favor, intente más tarde');
        } else {
          setError('❌ Error al generar el reporte. Verifique que el servicio esté disponible');
        }
      } else {
        setError('❌ Error inesperado al generar el reporte');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfBase64) {
      setError('❌ No hay PDF disponible para descargar');
      return;
    }

    try {
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `estado-cuenta-${clientName.replace(/\s+/g, '-')}-${startDate}-${endDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setError('✅ PDF descargado exitosamente');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('❌ Error al descargar el PDF');
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h1>Reporte de Estado de Cuenta</h1>
      </div>

      <div className="card">
        <div className="form-group">
          <label htmlFor="startDate">Fecha de Inicio:</label>
          <input
            id="startDate"
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">Fecha de Fin:</label>
          <input
            id="endDate"
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="clientName">Nombre del Cliente:</label>
          <input
            id="clientName"
            type="text"
            className="form-control"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Ingrese el nombre completo del cliente"
            disabled={loading}
          />
        </div>
        
        {error && (
          <div 
            className={`message ${error.includes('✅') ? 'success' : 'error'}`} 
            style={{ 
              margin: '10px 0', 
              padding: '10px', 
              borderRadius: '4px',
              backgroundColor: error.includes('✅') ? '#d4edda' : '#f8d7da',
              color: error.includes('✅') ? '#155724' : '#721c24',
              border: `1px solid ${error.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`
            }}
          >
            {error}
          </div>
        )}
        
        <button 
          className="btn btn-primary" 
          onClick={handleGenerateReport}
          disabled={loading || !startDate || !endDate || !clientName.trim()}
        >
          {loading ? 'Generando...' : 'Buscar Reporte'}
        </button>
      </div>

      {showResults && reportData.length > 0 && (
        <div className="card" style={{ marginTop: '20px' }}>
          <div className="view-header">
            <h2>Resultados del Reporte</h2>
            <button 
              className="btn btn-success" 
              onClick={handleDownloadPDF}
              disabled={!pdfBase64}
              style={{ marginLeft: 'auto' }}
            >
              📄 Descargar PDF
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>No. Cuenta</th>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{formatDate(transaction.date)}</td>
                    <td>{transaction.accountNumber}</td>
                    <td>{transaction.clientName}</td>
                    <td>
                      <span className={`status ${transaction.transactionType === 'Deposito' ? 'active' : 'inactive'}`}>
                        {transaction.transactionType}
                      </span>
                    </td>
                    <td className={transaction.transactionType === 'Deposito' ? 'positive' : 'negative'}>
                      {transaction.transactionType === 'Deposito' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </td>
                    <td>{formatCurrency(transaction.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="info-card" style={{ marginTop: '20px' }}>
        <h3>Instrucciones:</h3>
        <ul>
          <li>Complete todos los campos: fecha de inicio, fecha de fin y nombre del cliente</li>
          <li>Haga clic en "Buscar Reporte" para obtener los movimientos</li>
          <li>Si existen movimientos, se mostrará la lista de transacciones</li>
          <li>Use el botón "Descargar PDF" para obtener el reporte en formato PDF</li>
          <li>La fecha de inicio no puede ser mayor que la fecha de fin</li>
        </ul>
      </div>
    </div>
  );
};

export default TransactionReport;