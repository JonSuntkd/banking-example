package com.banking.transaction.adapters;

import com.banking.transaction.application.TransactionService;
import com.banking.transaction.application.dto.TransactionRequest;
import com.banking.transaction.application.dto.TransactionResponse;
import com.banking.transaction.application.dto.TransactionReportDTO;
import com.banking.transaction.application.dto.TransactionListResponse;
import com.banking.transaction.exception.GlobalExceptionHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@ExtendWith(MockitoExtension.class)
class TransactionControllerTest {

    @Mock
    private TransactionService transactionService;

    @InjectMocks
    private TransactionController transactionController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(transactionController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void createTransactionShouldReturnResponseWhenValidRequest() throws Exception {
        // Given
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("225487");
        request.setTransactionType("Deposito");
        request.setAmount(BigDecimal.valueOf(575.00));

        TransactionResponse response = new TransactionResponse();
        response.setAccountNumber("225487");
        response.setTransactionType("Deposito");
        response.setAmount(BigDecimal.valueOf(575.00));
        response.setBalance(BigDecimal.valueOf(1000.00));

        when(transactionService.createTransaction(any(TransactionRequest.class))).thenReturn(response);

        // When
        MvcResult result = mockMvc.perform(post("/transaction")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        // Then
        assertEquals(200, result.getResponse().getStatus());
        assertNotNull(result.getResponse().getContentAsString());
        verify(transactionService, times(1)).createTransaction(any(TransactionRequest.class));
    }

    @Test
    void getAllTransactionsShouldReturnTransactionList() throws Exception {
        // Given
        TransactionListResponse transaction = new TransactionListResponse();
        transaction.setAccountNumber("225487");
        transaction.setTransactionType("Deposito");
        transaction.setAmount(BigDecimal.valueOf(575.00));
        transaction.setBalance(BigDecimal.valueOf(1000.00));
        transaction.setTransactionDate(LocalDateTime.now());

        List<TransactionListResponse> transactions = Arrays.asList(transaction);
        when(transactionService.getAllTransactions()).thenReturn(transactions);

        // When
        MvcResult result = mockMvc.perform(get("/transaction"))
                .andReturn();

        // Then
        assertEquals(200, result.getResponse().getStatus());
        assertNotNull(result.getResponse().getContentAsString());
        verify(transactionService, times(1)).getAllTransactions();
    }

    @Test
    void getTransactionReportShouldReturnReportList() throws Exception {
        // Given
        TransactionReportDTO report = new TransactionReportDTO();
        report.setFecha("28/09/2025");
        report.setCliente("Test Client");
        report.setNumeroCuenta("225487");
        report.setTipo("Corriente");
        report.setSaldoInicial(BigDecimal.valueOf(100));
        report.setEstado(true);
        report.setMovimiento(BigDecimal.valueOf(575));
        report.setSaldoDisponible(BigDecimal.valueOf(675));

        List<TransactionReportDTO> reports = Arrays.asList(report);
        when(transactionService.getTransactionReport(anyString())).thenReturn(reports);

        // When
        MvcResult result = mockMvc.perform(get("/transaction/report")
                        .param("date", "28/09/2025"))
                .andReturn();

        // Then
        assertEquals(200, result.getResponse().getStatus());
        assertNotNull(result.getResponse().getContentAsString());
        verify(transactionService, times(1)).getTransactionReport(anyString());
    }

    @Test
    void getTransactionReportShouldReturnErrorWhenDateParameterMissing() throws Exception {
        // When
        MvcResult result = mockMvc.perform(get("/transaction/report"))
                .andReturn();

        // Then
        assertEquals(400, result.getResponse().getStatus());
        String responseContent = result.getResponse().getContentAsString();
        assertTrue(responseContent.contains("date") || responseContent.contains("required") || responseContent.contains("parameter"));
        verify(transactionService, never()).getTransactionReport(anyString());
    }

    @Test
    void getTransactionReportShouldReturnErrorWhenNoMovementsFound() throws Exception {
        // Given
        when(transactionService.getTransactionReport(anyString()))
                .thenThrow(new RuntimeException("No existen movimientos en la fecha 28/09/2025"));

        // When
        MvcResult result = mockMvc.perform(get("/transaction/report")
                        .param("date", "28/09/2025"))
                .andReturn();

        // Then
        assertEquals(400, result.getResponse().getStatus());
        assertTrue(result.getResponse().getContentAsString().contains("No existen movimientos en la fecha 28/09/2025"));
        verify(transactionService, times(1)).getTransactionReport(anyString());
    }

    @Test
    void updateTransactionShouldReturnUpdatedTransaction() throws Exception {
        // Given
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("225487");
        request.setTransactionType("Retiro");
        request.setAmount(BigDecimal.valueOf(100.00));

        TransactionResponse response = new TransactionResponse();
        response.setAccountNumber("225487");
        response.setTransactionType("Retiro");
        response.setAmount(BigDecimal.valueOf(100.00));
        response.setBalance(BigDecimal.valueOf(900.00));

        when(transactionService.updateTransaction(anyLong(), any(TransactionRequest.class))).thenReturn(response);

        // When
        MvcResult result = mockMvc.perform(put("/transaction/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        // Then
        assertEquals(200, result.getResponse().getStatus());
        assertNotNull(result.getResponse().getContentAsString());
        verify(transactionService, times(1)).updateTransaction(anyLong(), any(TransactionRequest.class));
    }

    @Test
    void deleteTransactionShouldReturnNoContent() throws Exception {
        // Given
        doNothing().when(transactionService).deleteTransaction(anyLong());

        // When
        MvcResult result = mockMvc.perform(delete("/transaction/1"))
                .andReturn();

        // Then
        assertEquals(204, result.getResponse().getStatus());
        verify(transactionService, times(1)).deleteTransaction(anyLong());
    }

    @Test
    void createTransactionShouldReturnErrorWhenAccountIsInactive() throws Exception {
        // Given
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("INACTIVE_ACCOUNT");
        request.setTransactionType("Deposito");
        request.setAmount(BigDecimal.valueOf(100.00));

        when(transactionService.createTransaction(any(TransactionRequest.class)))
                .thenThrow(new RuntimeException("La cuenta está desactivada"));

        // When
        MvcResult result = mockMvc.perform(post("/transaction")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        // Then
        assertEquals(400, result.getResponse().getStatus());
        String responseContent = result.getResponse().getContentAsString();
        assertTrue(responseContent.contains("desactivada") || responseContent.contains("cuenta"),
                "Response content was: " + responseContent);
        verify(transactionService, times(1)).createTransaction(any(TransactionRequest.class));
    }

    @Test
    void createTransactionShouldReturnErrorWhenAccountNotExists() throws Exception {
        // Given
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("NON_EXISTENT");
        request.setTransactionType("Deposito");
        request.setAmount(BigDecimal.valueOf(100.00));

        when(transactionService.createTransaction(any(TransactionRequest.class)))
                .thenThrow(new RuntimeException("La cuenta no existe"));

        // When
        MvcResult result = mockMvc.perform(post("/transaction")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        // Then
        assertEquals(400, result.getResponse().getStatus());
        assertTrue(result.getResponse().getContentAsString().contains("La cuenta no existe"));
        verify(transactionService, times(1)).createTransaction(any(TransactionRequest.class));
    }

    @Test
    void createTransactionShouldReturnErrorWhenInsufficientFunds() throws Exception {
        // Given
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("225487");
        request.setTransactionType("Retiro");
        request.setAmount(BigDecimal.valueOf(10000.00)); // Monto muy alto

        when(transactionService.createTransaction(any(TransactionRequest.class)))
                .thenThrow(new RuntimeException("No se puede realizar esta transacción por falta de dinero"));

        // When
        MvcResult result = mockMvc.perform(post("/transaction")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        // Then
        assertEquals(400, result.getResponse().getStatus());
        String responseContent = result.getResponse().getContentAsString();
        assertTrue(responseContent.contains("falta de dinero") || responseContent.contains("transacci") || responseContent.contains("dinero"),
                "Response content was: " + responseContent);
        verify(transactionService, times(1)).createTransaction(any(TransactionRequest.class));
    }
}