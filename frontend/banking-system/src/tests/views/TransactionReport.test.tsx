import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import TransactionReport from '../../presentation/views/TransactionReport';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock window.open y URL.createObjectURL
const mockWindowOpen = jest.fn();
const mockCreateObjectURL = jest.fn();
const mockRevokeObjectURL = jest.fn();

Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen,
});

Object.defineProperty(window.URL, 'createObjectURL', {
  writable: true,
  value: mockCreateObjectURL,
});

Object.defineProperty(window.URL, 'revokeObjectURL', {
  writable: true,
  value: mockRevokeObjectURL,
});

// Mock atob
Object.defineProperty(window, 'atob', {
  writable: true,
  value: jest.fn((str) => str),
});

describe('TransactionReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateObjectURL.mockReturnValue('blob:mock-url');
    mockWindowOpen.mockReturnValue({ document: { title: '' } });
  });

  const mockReportData = {
    reportData: [
      {
        fecha: '28/09/2025',
        cliente: 'Jose Lema',
        numeroCuenta: '478758',
        tipo: 'Ahorro',
        saldoInicial: 1375.00,
        estado: true,
        movimiento: 575.00,
        saldoDisponible: 1425.00,
      },
    ],
    pdfBase64: 'mockBase64String',
  };

  it('should render the component with initial state', () => {
    render(<TransactionReport />);
    
    expect(screen.getByText('Reporte de Estado de Cuenta')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha de Inicio:')).toBeInTheDocument();
    expect(screen.getByLabelText('Fecha de Fin:')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre del Cliente:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /buscar reporte/i })).toBeInTheDocument();
  });

  it('should show validation error when fields are empty', async () => {
    render(<TransactionReport />);
    
    const searchButton = screen.getByRole('button', { name: /buscar reporte/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/por favor complete todos los campos/i)).toBeInTheDocument();
    });
  });

  it('should show validation error when start date is greater than end date', async () => {
    render(<TransactionReport />);
    
    const startDateInput = screen.getByLabelText('Fecha de Inicio:');
    const endDateInput = screen.getByLabelText('Fecha de Fin:');
    const clientNameInput = screen.getByLabelText('Nombre del Cliente:');
    const searchButton = screen.getByRole('button', { name: /buscar reporte/i });

    fireEvent.change(startDateInput, { target: { value: '2025-09-29' } });
    fireEvent.change(endDateInput, { target: { value: '2025-09-01' } });
    fireEvent.change(clientNameInput, { target: { value: 'Jose Lema' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/la fecha de inicio no puede ser mayor que la fecha de fin/i)).toBeInTheDocument();
    });
  });

  it('should fetch report data successfully and show results', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockReportData });
    
    render(<TransactionReport />);
    
    const startDateInput = screen.getByLabelText('Fecha de Inicio:');
    const endDateInput = screen.getByLabelText('Fecha de Fin:');
    const clientNameInput = screen.getByLabelText('Nombre del Cliente:');
    const searchButton = screen.getByRole('button', { name: /buscar reporte/i });

    fireEvent.change(startDateInput, { target: { value: '2025-09-01' } });
    fireEvent.change(endDateInput, { target: { value: '2025-09-29' } });
    fireEvent.change(clientNameInput, { target: { value: 'Jose Lema' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Resultados del Reporte')).toBeInTheDocument();
      expect(screen.getByText('Jose Lema')).toBeInTheDocument();
      expect(screen.getByText('478758')).toBeInTheDocument();
      expect(screen.getByText('Ahorro')).toBeInTheDocument();
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      '/transaction/reports-report?startDate=2025-09-01&endDate=2025-09-29&clientName=Jose%20Lema'
    );
  });

  it('should handle download PDF functionality', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockReportData });
    
    render(<TransactionReport />);
    
    // First generate report
    const startDateInput = screen.getByLabelText('Fecha de Inicio:');
    const endDateInput = screen.getByLabelText('Fecha de Fin:');
    const clientNameInput = screen.getByLabelText('Nombre del Cliente:');
    const searchButton = screen.getByRole('button', { name: /buscar reporte/i });

    fireEvent.change(startDateInput, { target: { value: '2025-09-01' } });
    fireEvent.change(endDateInput, { target: { value: '2025-09-29' } });
    fireEvent.change(clientNameInput, { target: { value: 'Jose Lema' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Resultados del Reporte')).toBeInTheDocument();
    });

    // Test download PDF
    const downloadButton = screen.getByRole('button', { name: /📄 descargar pdf/i });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockWindowOpen).toHaveBeenCalledWith(
        'blob:mock-url',
        '_blank',
        'width=800,height=600,scrollbars=yes,resizable=yes'
      );
    });
  });

  it('should handle preview PDF functionality', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockReportData });
    
    render(<TransactionReport />);
    
    // First generate report
    const startDateInput = screen.getByLabelText('Fecha de Inicio:');
    const endDateInput = screen.getByLabelText('Fecha de Fin:');
    const clientNameInput = screen.getByLabelText('Nombre del Cliente:');
    const searchButton = screen.getByRole('button', { name: /buscar reporte/i });

    fireEvent.change(startDateInput, { target: { value: '2025-09-01' } });
    fireEvent.change(endDateInput, { target: { value: '2025-09-29' } });
    fireEvent.change(clientNameInput, { target: { value: 'Jose Lema' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Resultados del Reporte')).toBeInTheDocument();
    });

    // Test preview PDF
    const previewButton = screen.getByRole('button', { name: /👁️ vista previa/i });
    fireEvent.click(previewButton);

    await waitFor(() => {
      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockWindowOpen).toHaveBeenCalledWith(
        'blob:mock-url',
        '_blank',
        'width=900,height=700,scrollbars=yes,resizable=yes'
      );
    });
  });

  it('should handle API error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
    
    render(<TransactionReport />);
    
    const startDateInput = screen.getByLabelText('Fecha de Inicio:');
    const endDateInput = screen.getByLabelText('Fecha de Fin:');
    const clientNameInput = screen.getByLabelText('Nombre del Cliente:');
    const searchButton = screen.getByRole('button', { name: /buscar reporte/i });

    fireEvent.change(startDateInput, { target: { value: '2025-09-01' } });
    fireEvent.change(endDateInput, { target: { value: '2025-09-29' } });
    fireEvent.change(clientNameInput, { target: { value: 'Jose Lema' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/error inesperado al generar el reporte/i)).toBeInTheDocument();
    });
  });

  it('should handle empty report data', async () => {
    mockedAxios.get.mockResolvedValueOnce({ 
      data: { reportData: [], pdfBase64: '' }
    });
    
    render(<TransactionReport />);
    
    const startDateInput = screen.getByLabelText('Fecha de Inicio:');
    const endDateInput = screen.getByLabelText('Fecha de Fin:');
    const clientNameInput = screen.getByLabelText('Nombre del Cliente:');
    const searchButton = screen.getByRole('button', { name: /buscar reporte/i });

    fireEvent.change(startDateInput, { target: { value: '2025-09-01' } });
    fireEvent.change(endDateInput, { target: { value: '2025-09-29' } });
    fireEvent.change(clientNameInput, { target: { value: 'Jose Lema' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText(/no se encontraron movimientos para el cliente/i)).toBeInTheDocument();
    });
  });

  it('should show error when trying to download PDF without data', async () => {
    render(<TransactionReport />);
    
    // Simulate having report data but no PDF
    mockedAxios.get.mockResolvedValueOnce({ 
      data: { 
        reportData: mockReportData.reportData, 
        pdfBase64: '' 
      }
    });
    
    const startDateInput = screen.getByLabelText('Fecha de Inicio:');
    const endDateInput = screen.getByLabelText('Fecha de Fin:');
    const clientNameInput = screen.getByLabelText('Nombre del Cliente:');
    const searchButton = screen.getByRole('button', { name: /buscar reporte/i });

    fireEvent.change(startDateInput, { target: { value: '2025-09-01' } });
    fireEvent.change(endDateInput, { target: { value: '2025-09-29' } });
    fireEvent.change(clientNameInput, { target: { value: 'Jose Lema' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Resultados del Reporte')).toBeInTheDocument();
    });

    // Try to download without PDF data
    const downloadButton = screen.getByRole('button', { name: /📄 descargar pdf/i });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(screen.getByText(/no hay pdf disponible para descargar/i)).toBeInTheDocument();
    });
  });
});