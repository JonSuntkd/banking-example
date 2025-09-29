import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { TransactionReport } from '../../domain/entities/transaction.entity';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  generateTransactionReport(transactions: TransactionReport[], reportDate: string): void {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('BANCO - Reporte de Movimientos', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Fecha: ${reportDate}`, 20, 35);
    doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 20, 45);
    
    // Line separator
    doc.line(20, 55, 190, 55);
    
    let yPosition = 70;
    
    if (transactions.length === 0) {
      doc.text('No se encontraron movimientos para la fecha seleccionada', 20, yPosition);
    } else {
      // Table headers
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      
      const headers = ['Fecha', 'Cliente', 'Cuenta', 'Tipo', 'Saldo Inicial', 'Movimiento', 'Saldo Disponible'];
      const columnWidths = [25, 35, 25, 20, 25, 25, 30];
      let xPosition = 20;
      
      headers.forEach((header, index) => {
        doc.text(header, xPosition, yPosition);
        xPosition += columnWidths[index];
      });
      
      yPosition += 10;
      doc.line(20, yPosition - 5, 190, yPosition - 5);
      
      // Table data
      doc.setFont('helvetica', 'normal');
      
      transactions.forEach(transaction => {
        if (yPosition > 260) { // Nueva página si es necesario
          doc.addPage();
          yPosition = 20;
        }
        
        xPosition = 20;
        const rowData = [
          transaction.fecha,
          transaction.cliente.substring(0, 15), // Truncar nombre si es muy largo
          transaction.numeroCuenta,
          transaction.tipo,
          `$${transaction.saldoInicial.toFixed(2)}`,
          `$${transaction.movimiento.toFixed(2)}`,
          `$${transaction.saldoDisponible.toFixed(2)}`
        ];
        
        rowData.forEach((data, index) => {
          doc.text(data, xPosition, yPosition);
          xPosition += columnWidths[index];
        });
        
        yPosition += 8;
      });
      
      // Summary
      yPosition += 10;
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 10;
      
      const totalMovimientos = transactions.length;
      const totalDepositos = transactions.filter(t => t.movimiento > 0).length;
      const totalRetiros = transactions.filter(t => t.movimiento < 0).length;
      
      doc.setFont('helvetica', 'bold');
      doc.text('RESUMEN:', 20, yPosition);
      yPosition += 10;
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Total de movimientos: ${totalMovimientos}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Depósitos: ${totalDepositos}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Retiros: ${totalRetiros}`, 20, yPosition);
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Página ${i} de ${pageCount}`, 170, 285);
      doc.text('Banking System - Confidencial', 20, 285);
    }
    
    // Save the PDF
    const fileName = `reporte-movimientos-${reportDate.replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
  }
}