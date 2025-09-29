import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Views.css';

const TransactionReport: React.FC = () => {
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    if (!date) {
      setError('Por favor selecciona una fecha');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Llamar al endpoint para obtener el PDF
      const response = await axios.get(`/transaction/report?date=${date}`, {
        responseType: 'blob', // Importante para manejar archivos binarios
        headers: {
          'Accept': 'application/pdf'
        }
      });

      // Crear un blob URL y descargar el archivo
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-movimientos-${date}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error generating report:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setError('No se encontraron movimientos para la fecha seleccionada');
        } else if (error.response && error.response.status >= 500) {
          setError('Error del servidor. Por favor, intente más tarde');
        } else {
          setError('Error al generar el reporte. Verifique que el servicio esté disponible');
        }
      } else {
        setError('Error inesperado al generar el reporte');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h1>Reporte de Movimientos</h1>
      </div>

      <div className="card">
        <div className="form-group">
          <label htmlFor="reportDate">Fecha del Reporte:</label>
          <input
            id="reportDate"
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={loading}
          />
        </div>
        
        {error && (
          <div className="error" style={{ color: 'red', margin: '10px 0' }}>
            {error}
          </div>
        )}
        
        <button 
          className="btn btn-primary" 
          onClick={handleGenerateReport}
          disabled={loading || !date}
        >
          {loading ? 'Generando...' : 'Buscar y Descargar PDF'}
        </button>
      </div>

      <div className="info-card" style={{ marginTop: '20px' }}>
        <h3>Instrucciones:</h3>
        <ul>
          <li>Selecciona una fecha usando el selector de fecha</li>
          <li>Haz clic en "Buscar y Descargar PDF" para generar el reporte</li>
          <li>El archivo PDF se descargará automáticamente con los movimientos de la fecha seleccionada</li>
          <li>El reporte incluye todas las transacciones realizadas en la fecha especificada</li>
        </ul>
      </div>
    </div>
  );
};

export default TransactionReport;