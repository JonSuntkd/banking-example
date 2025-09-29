import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Views.css';

const TransactionReport: React.FC = () => {
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para convertir fecha de YYYY-MM-DD a DD/MM/YYYY
  const formatDateForServer = (inputDate: string): string => {
    if (!inputDate) return '';
    
    const [year, month, day] = inputDate.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    console.log(`Convirtiendo fecha: ${inputDate} -> ${formattedDate}`);
    return formattedDate;
  };



  const handleGenerateReport = async () => {
    if (!date) {
      setError('Por favor selecciona una fecha');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Convertir la fecha al formato que espera el servidor (DD/MM/YYYY)
      const serverDate = formatDateForServer(date);
      const reportUrl = `/transaction/report?date=${serverDate}`;
      
      console.log('Haciendo petición a:', reportUrl);
      console.log('Fecha seleccionada (input):', date);
      console.log('Fecha formateada para servidor:', serverDate);
      
      // Primero intentar con el servidor real
      try {
        const response = await axios.get(reportUrl, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf'
          },
          timeout: 10000
        });

        console.log('Respuesta recibida del servidor real:', response.status);
        console.log('Content-Type:', response.headers['content-type']);
        
        // Crear un blob URL y descargar el archivo
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-movimientos-${serverDate.replace(/\//g, '-')}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        setError('✅ Reporte descargado exitosamente');
        
      } catch (serverError) {
        console.warn('Error al generar reporte:', serverError);
        
        if (axios.isAxiosError(serverError) && serverError.response) {
          console.log('Status del error:', serverError.response.status);
          
          // Verificar si es un error 404 o similar que indica "no data found"
          if (serverError.response.status === 404 || serverError.response.status === 204) {
            setError('❌ No se encontraron movimientos para la fecha seleccionada');
            return;
          }
          
          // Para otros errores del servidor
          if (serverError.response.status >= 500) {
            setError('❌ Error del servidor. Por favor, intente más tarde');
            return;
          }
        }
        
        // Error genérico
        setError('❌ No se encontraron movimientos para la fecha seleccionada');
      }
      
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
          disabled={loading || !date}
        >
          {loading ? 'Generando...' : 'Buscar y Descargar PDF'}
        </button>
      </div>

      <div className="info-card" style={{ marginTop: '20px' }}>
        <h3>Instrucciones:</h3>
        <ul>
          <li>Selecciona una fecha usando el selector</li>
          <li>Haz clic en "Buscar y Descargar PDF" para obtener el reporte</li>
          <li>Si existen movimientos para esa fecha, se descargará automáticamente el PDF</li>
          <li>Si no hay movimientos, se mostrará un mensaje informativo</li>
        </ul>
      </div>
    </div>
  );
};

export default TransactionReport;