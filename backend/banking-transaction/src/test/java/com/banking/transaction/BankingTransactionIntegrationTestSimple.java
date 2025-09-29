package com.banking.transaction;

import com.banking.transaction.application.dto.TransactionRequest;
import com.banking.transaction.infrastructure.AccountEntity;
import com.banking.transaction.infrastructure.AccountRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
class BankingTransactionIntegrationTestSimple {

    @Autowired
    private WebApplicationContext webApplicationContext;
    
    private MockMvc mockMvc;

    @Autowired
    private AccountRepository accountRepository;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        
        // Setup test data
        AccountEntity testAccount = new AccountEntity();
        testAccount.setAccountNumber("225487");
        testAccount.setAccountType("Corriente");
        testAccount.setInitialBalance(BigDecimal.valueOf(1000.00));
        testAccount.setStatus(true);
        accountRepository.save(testAccount);
    }

    @Test
    void createDepositTransactionShouldReturnSuccessResponse() throws Exception {
        // Given
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("225487");
        request.setTransactionType("Deposito");
        request.setAmount(BigDecimal.valueOf(500.00));

        // When
        MvcResult result = mockMvc.perform(post("/transaction")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        // Then
        assertEquals(200, result.getResponse().getStatus());
        assertNotNull(result.getResponse().getContentAsString());
    }

    @Test
    void createWithdrawalTransactionShouldReturnSuccessResponse() throws Exception {
        // Given
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("225487");
        request.setTransactionType("Retiro");
        request.setAmount(BigDecimal.valueOf(200.00));

        // When
        MvcResult result = mockMvc.perform(post("/transaction")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        // Then
        assertEquals(200, result.getResponse().getStatus());
        assertNotNull(result.getResponse().getContentAsString());
    }

    @Test
    void createTransactionShouldReturnErrorWhenAccountNotExists() throws Exception {
        // Given
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("999999");
        request.setTransactionType("Deposito");
        request.setAmount(BigDecimal.valueOf(500.00));

        // When
        MvcResult result = mockMvc.perform(post("/transaction")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        // Then
        assertEquals(400, result.getResponse().getStatus());
    }

    @Test
    void createTransactionShouldReturnErrorWhenInsufficientFunds() throws Exception {
        // Given
        TransactionRequest request = new TransactionRequest();
        request.setAccountNumber("225487");
        request.setTransactionType("Retiro");
        request.setAmount(BigDecimal.valueOf(2000.00)); // More than available balance

        // When
        MvcResult result = mockMvc.perform(post("/transaction")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();

        // Then
        assertEquals(400, result.getResponse().getStatus());
    }

    @Test
    void getAllTransactionsShouldReturnTransactionList() throws Exception {
        // When
        MvcResult result = mockMvc.perform(get("/transaction"))
                .andReturn();

        // Then
        assertEquals(200, result.getResponse().getStatus());
        assertNotNull(result.getResponse().getContentAsString());
    }

    @Test
    void getTransactionReportShouldReturnErrorWhenNoTransactionsFound() throws Exception {
        // When
        MvcResult result = mockMvc.perform(get("/transaction/report")
                        .param("date", "28/09/2025"))
                .andReturn();

        // Then
        assertEquals(400, result.getResponse().getStatus());
        String responseContent = result.getResponse().getContentAsString();
        assertTrue(responseContent.contains("No existen movimientos") || responseContent.contains("movimientos") || responseContent.contains("fecha"),
                "Response content was: " + responseContent);
    }
}