import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Views.css';
import jsPDF from 'jspdf';

interface ReportData {
  fecha: string;
  cliente: string;
  numeroCuenta: string;
  tipo: string;
  saldoInicial: number;
  estado: boolean;
  movimiento: number;
  saldoDisponible: number;
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
    const [error, setError] = useState<string>('');

  // Función para convertir texto plano a PDF
  const convertTextToPDF = (textContent: string, fileName: string): Blob => {
    const doc = new jsPDF();
    
    // Configurar la fuente y tamaño
    doc.setFontSize(12);
    
    // Título del documento
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORTE DE ESTADO DE CUENTA', 105, 20, { align: 'center' });
    
    // Línea separadora
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    // Información del cliente y fecha
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    let yPosition = 35;
    
    // Procesar el contenido línea por línea
    const lines = textContent.split('\\n');
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 20;
    
    lines.forEach((line) => {
      // Limpiar caracteres de escape y espacios extra
      const cleanLine = line.replace(/\\n/g, '').replace(/\\t/g, '    ').trim();
      
      if (cleanLine) {
        // Verificar si necesitamos una nueva página
        if (yPosition > pageHeight - marginBottom) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Ajustar el estilo según el contenido
        if (cleanLine.includes('Cliente:') || cleanLine.includes('Fecha:')) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
        } else if (cleanLine.includes('Número de Cuenta:') || cleanLine.includes('Tipo:')) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
        } else if (cleanLine.includes('---') || cleanLine === '') {
          // Líneas separadoras o vacías
          if (cleanLine.includes('---')) {
            doc.setLineWidth(0.3);
            doc.line(20, yPosition, 190, yPosition);
          }
          yPosition += 5;
          return;
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
        }
        
        // Dividir líneas largas
        const splitLines = doc.splitTextToSize(cleanLine, 170);
        
        if (Array.isArray(splitLines)) {
          splitLines.forEach((splitLine) => {
            if (yPosition > pageHeight - marginBottom) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(splitLine, 20, yPosition);
            yPosition += 6;
          });
        } else {
          doc.text(splitLines, 20, yPosition);
          yPosition += 6;
        }
      }
    });
    
    // Pie de página con fecha de generación
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text(`Generado el: ${new Date().toLocaleString('es-ES')}`, 20, pageHeight - 10);
      doc.text(`Página ${i} de ${totalPages}`, 190, pageHeight - 10, { align: 'right' });
    }
    
    // Retornar el PDF como blob
    return doc.output('blob');
  };
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
      setError('');
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
      console.log('Base64 original length:', pdfBase64.length);
      console.log('Base64 primeros 50 caracteres:', pdfBase64.substring(0, 50));
      
      // Limpiar el base64 - remover posibles prefijos y espacios
      let cleanBase64 = pdfBase64.trim();
      
      // Remover prefijo data:application/pdf;base64, si existe
      if (cleanBase64.startsWith('data:application/pdf;base64,')) {
        cleanBase64 = cleanBase64.substring('data:application/pdf;base64,'.length);
      }
      
      // Validar que sea base64 válido
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
        throw new Error('Formato base64 inválido');
      }
      
      console.log('Base64 limpio length:', cleanBase64.length);
      
      // Convertir base64 a binary
      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      console.log('Tamaño del array de bytes:', byteArray.length);
      
      // Verificar que comience con la cabecera PDF
      const pdfHeader = new TextDecoder().decode(byteArray.slice(0, 4));
      console.log('PDF Header:', pdfHeader);
      
      if (!pdfHeader.startsWith('%PDF')) {
        console.warn('⚠️ El contenido no es un PDF válido. Detectando tipo de contenido...');
        
        // Decodificar todo el contenido para ver qué es
        const fullContent = new TextDecoder().decode(byteArray);
        console.log('Contenido completo:', fullContent);
        
        // Si parece ser un reporte de texto, convertirlo a PDF
        if (fullContent.includes('REPORTE') && fullContent.includes('ESTADO DE CUENTA')) {
          console.log('🔍 Detectado reporte en formato texto - convirtiendo a PDF');
          
          // Convertir el texto a PDF
          const pdfBlob = convertTextToPDF(fullContent, `estado-cuenta-${clientName.replace(/\s+/g, '-')}-${startDate}-${endDate}`);
          const pdfUrl = window.URL.createObjectURL(pdfBlob);
          
          // Descargar el PDF generado
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = `estado-cuenta-${clientName.replace(/\s+/g, '-')}-${startDate}-${endDate}.pdf`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          
          // Abrir vista previa en nueva ventana después de la descarga
          setTimeout(() => {
            const previewWindow = window.open(pdfUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
            if (previewWindow) {
              previewWindow.document.title = `Vista Previa - Estado de Cuenta ${clientName}`;
            } else {
              setError('⚠️ PDF descargado. No se pudo abrir la vista previa (popup bloqueado)');
              window.URL.revokeObjectURL(pdfUrl);
              return;
            }
            
            // Limpiar la URL después de un tiempo
            setTimeout(() => {
              window.URL.revokeObjectURL(pdfUrl);
            }, 60000); // 1 minuto
          }, 500);
          
          setError('✅ PDF generado, descargado exitosamente y vista previa abierta');
          return;
        }
        
        console.warn('El archivo no parece ser un PDF válido');
        // Intentar de todos modos si no se detecta como texto
      }
      
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      console.log('Blob creado, tamaño:', blob.size);
      
      const url = window.URL.createObjectURL(blob);
      
      // Descargar el PDF
      const link = document.createElement('a');
      link.href = url;
      link.download = `estado-cuenta-${clientName.replace(/\s+/g, '-')}-${startDate}-${endDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Abrir vista previa en nueva ventana después de la descarga
      setTimeout(() => {
        const previewWindow = window.open(url, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
        if (previewWindow) {
          previewWindow.document.title = `Vista Previa - Estado de Cuenta ${clientName}`;
        } else {
          setError('⚠️ PDF descargado. No se pudo abrir la vista previa (popup bloqueado)');
          window.URL.revokeObjectURL(url);
          return;
        }
        
        // Limpiar la URL después de un tiempo
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 60000); // 1 minuto
      }, 500); // Aumentar el delay
      
      setError('✅ PDF descargado exitosamente y vista previa abierta');
    } catch (error) {
      console.error('Error detallado al procesar PDF:', error);
      console.error('Base64 que causó el error:', pdfBase64.substring(0, 100) + '...');
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(`❌ Error al procesar el PDF: ${errorMessage}`);
    }
  };

  const handlePreviewPDF = () => {
    if (!pdfBase64) {
      setError('❌ No hay PDF disponible para previsualizar');
      return;
    }

    try {
      console.log('=== DIAGNÓSTICO PDF PREVIEW ===');
      console.log('Base64 original length:', pdfBase64.length);
      console.log('Base64 primeros 100 caracteres:', pdfBase64.substring(0, 100));
      console.log('Base64 últimos 20 caracteres:', pdfBase64.slice(-20));
      
      // Limpiar el base64
      let cleanBase64 = pdfBase64.trim();
      
      // Remover prefijo data:application/pdf;base64, si existe
      if (cleanBase64.startsWith('data:application/pdf;base64,')) {
        cleanBase64 = cleanBase64.substring('data:application/pdf;base64,'.length);
        console.log('Prefijo data: removido');
      }
      
      // Validar que sea base64 válido
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
        console.error('Base64 inválido:', cleanBase64.substring(0, 50));
        throw new Error('Formato base64 inválido');
      }
      
      console.log('Base64 limpio length:', cleanBase64.length);
      console.log('Base64 limpio primeros 50:', cleanBase64.substring(0, 50));
      
      // Convertir base64 a binary
      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      console.log('Bytes array length:', byteArray.length);
      console.log('Primeros 20 bytes:', Array.from(byteArray.slice(0, 20)));
      
      // Verificar cabecera PDF
      const pdfHeader = new TextDecoder().decode(byteArray.slice(0, 8));
      console.log('PDF Header detectado:', pdfHeader);
      console.log('Es PDF válido:', pdfHeader.startsWith('%PDF'));
      
      // Si no es un PDF válido, podría ser contenido de texto plano
      if (!pdfHeader.startsWith('%PDF')) {
        console.warn('⚠️ El contenido no es un PDF válido. Detectando tipo de contenido...');
        
        // Decodificar todo el contenido para ver qué es
        const fullContent = new TextDecoder().decode(byteArray);
        console.log('Contenido completo:', fullContent);
        
        // Si parece ser un reporte de texto, convertirlo a PDF
        if (fullContent.includes('REPORTE') && fullContent.includes('ESTADO DE CUENTA')) {
          console.log('🔍 Detectado reporte en formato texto - convirtiendo a PDF para vista previa');
          
          // Convertir el texto a PDF
          const pdfBlob = convertTextToPDF(fullContent, `estado-cuenta-${clientName.replace(/\s+/g, '-')}-${startDate}-${endDate}`);
          const pdfUrl = window.URL.createObjectURL(pdfBlob);
          
          console.log('PDF generado exitosamente, tamaño:', pdfBlob.size);
          console.log('URL del blob:', pdfUrl);
          
          // Solo abrir vista previa sin descargar
          const previewWindow = window.open(pdfUrl, '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');
          if (previewWindow) {
            previewWindow.document.title = `Vista Previa - Estado de Cuenta ${clientName}`;
            setError('✅ PDF generado y vista previa abierta exitosamente');
            
            // Limpiar la URL después de un tiempo
            setTimeout(() => {
              window.URL.revokeObjectURL(pdfUrl);
            }, 60000); // 1 minuto
          } else {
            setError('❌ No se pudo abrir la vista previa (popup bloqueado)');
            window.URL.revokeObjectURL(pdfUrl);
          }
          return;
        }
        
        throw new Error(`El archivo no tiene una cabecera PDF válida. Contenido detectado: ${fullContent.substring(0, 100)}...`);
      }
      
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      console.log('Blob creado exitosamente, tamaño:', blob.size);
      
      const url = window.URL.createObjectURL(blob);
      console.log('URL del blob:', url);
      
      // Solo abrir vista previa sin descargar
      const previewWindow = window.open(url, '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');
      if (previewWindow) {
        previewWindow.document.title = `Vista Previa - Estado de Cuenta ${clientName}`;
        setError('✅ Vista previa abierta exitosamente');
        
        // Limpiar la URL después de un tiempo
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 60000); // 1 minuto
      } else {
        setError('❌ No se pudo abrir la vista previa (popup bloqueado)');
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error detallado en preview:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(`❌ Error en vista previa: ${errorMessage}`);
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
    // La fecha ya viene en formato DD/MM/YYYY, solo la devolvemos tal como está
    return dateString;
  };

  const getMovementType = (movimiento: number): string => {
    return movimiento > 0 ? 'Depósito' : 'Retiro';
  };

  const getStatusText = (estado: boolean): string => {
    return estado ? 'Activa' : 'Inactiva';
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
            <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
              <button 
                className="btn btn-secondary" 
                onClick={handlePreviewPDF}
                disabled={!pdfBase64}
                title="Ver vista previa del PDF"
              >
                👁️ Vista Previa
              </button>
              <button 
                className="btn btn-success" 
                onClick={handleDownloadPDF}
                disabled={!pdfBase64}
                title="Descargar PDF y abrir vista previa"
              >
                📄 Descargar PDF
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>No. Cuenta</th>
                  <th>Tipo</th>
                  <th>Estado</th>
                  <th>Saldo Inicial</th>
                  <th>Movimiento</th>
                  <th>Saldo Disponible</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((transaction, index) => (
                  <tr key={index}>
                    <td>{formatDate(transaction.fecha)}</td>
                    <td>{transaction.cliente}</td>
                    <td>{transaction.numeroCuenta}</td>
                    <td>{transaction.tipo}</td>
                    <td>
                      <span className={`status ${transaction.estado ? 'active' : 'inactive'}`}>
                        {getStatusText(transaction.estado)}
                      </span>
                    </td>
                    <td>{formatCurrency(transaction.saldoInicial)}</td>
                    <td className={transaction.movimiento > 0 ? 'positive' : 'negative'}>
                      {transaction.movimiento > 0 ? '+' : ''}{formatCurrency(transaction.movimiento)}
                    </td>
                    <td>{formatCurrency(transaction.saldoDisponible)}</td>
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
          <li>Use el botón "👁️ Vista Previa" para ver el PDF sin descargarlo</li>
          <li>Use el botón "📄 Descargar PDF" para descargar el archivo y abrir vista previa automáticamente</li>
          <li>La fecha de inicio no puede ser mayor que la fecha de fin</li>
          <li>Si aparece "popup bloqueado", permita ventanas emergentes para ver la vista previa</li>
        </ul>
      </div>
    </div>
  );
};

export default TransactionReport;