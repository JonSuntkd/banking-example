import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Views.css';

const TransactionReport: React.FC = () => {
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para generar contenido PDF mock (texto simple)
  const generateMockPdfContent = (reportDate: string): string => {
    const content = `
REPORTE DE MOVIMIENTOS BANCARIOS (DATOS DE PRUEBA)
==================================================

Fecha del reporte: ${reportDate}
Generado el: ${new Date().toLocaleString()}

TRANSACCIONES ENCONTRADAS:
--------------------------

1. Depósito - $500.00
   Cliente: Juan Pérez
   Cuenta: 1001-2345
   Hora: 10:30 AM

2. Retiro - $150.00
   Cliente: María García
   Cuenta: 1001-6789
   Hora: 2:15 PM

3. Transferencia - $300.00
   Cliente: Carlos López
   Cuenta Origen: 1001-1111
   Cuenta Destino: 1001-2222
   Hora: 4:45 PM

RESUMEN:
--------
Total transacciones: 3
Monto total procesado: $950.00

Nota: Este es un reporte de prueba generado porque el servidor 
de transacciones no está disponible en el puerto 8003.
`;
    return content;
  };

  // Función para probar la conectividad con el servidor
  const testServerConnection = async () => {
    try {
      console.log('Probando conectividad con el servidor...');
      
      // Probar primero con el endpoint de health si existe
      try {
        const healthResponse = await axios.get('/transaction/health', {
          timeout: 5000
        });
        console.log('Health check exitoso:', healthResponse.status);
        setError('✅ Servidor disponible (health check OK)');
        return;
      } catch (healthError) {
        console.log('Health check falló, probando endpoint de reporte...', healthError);
      }
      
      // Probar con el endpoint de reporte usando una fecha de prueba
      const testDate = '2024-01-01';
      const response = await axios.get(`/transaction/report?date=${testDate}`, {
        timeout: 5000,
        headers: {
          'Accept': 'application/pdf'
        }
      });
      console.log('Endpoint de reporte respondió:', response.status);
      console.log('Content-Type:', response.headers['content-type']);
      setError('✅ Servidor responde - Endpoint de reporte disponible');
      
    } catch (error) {
      console.error('Error de conectividad:', error);
      if (axios.isAxiosError(error)) {
        console.log('Status:', error.response?.status);
        console.log('URL llamada:', error.config?.url);
        
        if (error.response?.status === 500) {
          setError(`⚠️ Servidor responde pero con error 500 - Revisar logs del servidor`);
        } else if (error.response?.status === 404) {
          setError(`❌ Endpoint no encontrado (404) - Verificar que /transaction/report existe`);
        } else {
          setError(`❌ Error del servidor (${error.response?.status || 'timeout'})`);
        }
      } else {
        setError(`❌ Error de red: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }
  };

  const handleGenerateReport = async () => {
    if (!date) {
      setError('Por favor selecciona una fecha');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Haciendo petición a:', `/transaction/report?date=${date}`);
      console.log('Fecha seleccionada:', date);
      
      // Primero intentar con el servidor real
      try {
        const response = await axios.get(`/transaction/report?date=${date}`, {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf'
          },
          timeout: 10000
        });

        console.log('Respuesta recibida del servidor real:', response.status);
        
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
        
      } catch (serverError) {
        console.warn('Servidor devolvió error:', serverError);
        
        if (axios.isAxiosError(serverError) && serverError.response) {
          console.log('Status del error:', serverError.response.status);
          console.log('Headers de la respuesta:', serverError.response.headers);
          
          // Intentar leer el contenido de la respuesta de error para debugging
          try {
            const errorBlob = serverError.response.data;
            const errorText = await errorBlob.text();
            console.log('Contenido del error del servidor:', errorText);
            
            // Si el servidor devolvió un error 500 pero con contenido útil
            if (serverError.response.status === 500) {
              setError(`❌ Error del servidor (500): ${errorText || 'Error interno del servidor'}`);
              return;
            }
          } catch (readError) {
            console.log('No se pudo leer el contenido del error:', readError);
          }
        }
        
        // Generar un reporte mock como fallback (archivo de texto como ejemplo)
        console.log('Generando reporte de respaldo...');
        const mockPdfContent = generateMockPdfContent(date);
        const blob = new Blob([mockPdfContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte-movimientos-mock-${date}.txt`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        setError('⚠️ Error del servidor - Descargando datos de prueba');
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
          <div className="error" style={{ color: 'red', margin: '10px 0' }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleGenerateReport}
            disabled={loading || !date}
          >
            {loading ? 'Generando...' : 'Buscar y Descargar PDF'}
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={testServerConnection}
            disabled={loading}
          >
            Probar Conectividad
          </button>
        </div>
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