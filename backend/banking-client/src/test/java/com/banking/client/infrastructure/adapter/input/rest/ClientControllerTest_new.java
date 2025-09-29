package com.banking.client.infrastructure.adapter.input.rest;

import com.banking.client.domain.exception.ClientAlreadyExistsException;
import com.banking.client.domain.exception.ClientNotFoundException;
import com.banking.client.domain.model.Client;
import com.banking.client.domain.model.Gender;
import com.banking.client.domain.model.Person;
import com.banking.client.domain.port.input.ClientUseCase;
import com.banking.client.infrastructure.adapter.input.rest.dto.ClientRequest;
import com.banking.client.infrastructure.adapter.input.rest.dto.ClientResponse;
import com.banking.client.infrastructure.adapter.input.rest.dto.ClientListResponse;
import com.banking.client.infrastructure.adapter.input.rest.dto.PersonRequest;
import com.banking.client.infrastructure.adapter.input.rest.dto.PersonResponse;
import com.banking.client.infrastructure.adapter.input.rest.dto.PersonListResponse;
import com.banking.client.infrastructure.adapter.input.rest.mapper.ClientRestMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ClientController.class)
class ClientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ClientUseCase clientUseCase;

    @MockBean
    private ClientRestMapper clientRestMapper;

    @Autowired
    private ObjectMapper objectMapper;

    private Person validPerson;
    private Client validClient;
    private PersonRequest validPersonRequest;
    private ClientRequest validClientRequest;
    private PersonResponse validPersonResponse;
    private ClientResponse validClientResponse;
    private PersonListResponse validPersonListResponse;
    private ClientListResponse validClientListResponse;

    @BeforeEach
    void setUp() {
        validPerson = Person.builder()
                .personId(1L)
                .fullName("Juan Pérez García")
                .gender(Gender.HOMBRE)
                .age(30)
                .identification("1234567890")
                .address("Av. Principal 123")
                .phone("+593-99-123-4567")
                .build();

        validClient = Client.builder()
                .clientId(1L)
                .person(validPerson)
                .password("password123")
                .status(true)
                .build();

        validPersonRequest = PersonRequest.builder()
                .fullName("Juan Pérez García")
                .gender(Gender.HOMBRE)
                .age(30)
                .identification("1234567890")
                .address("Av. Principal 123")
                .phone("+593-99-123-4567")
                .build();

        validClientRequest = ClientRequest.builder()
                .person(validPersonRequest)
                .password("password123")
                .status(true)
                .build();

        validPersonResponse = PersonResponse.builder()
                .personId(1L)
                .fullName("Juan Pérez García")
                .gender(Gender.HOMBRE)
                .age(30)
                .identification("1234567890")
                .address("Av. Principal 123")
                .phone("+593-99-123-4567")
                .build();

        validClientResponse = ClientResponse.builder()
                .clientId(1L)
                .person(validPersonResponse)
                .status(true)
                .build();

        validPersonListResponse = PersonListResponse.builder()
                .fullName("Juan Pérez García")
                .address("Av. Principal 123")
                .phone("+593-99-123-4567")
                .build();

        validClientListResponse = ClientListResponse.builder()
                .person(validPersonListResponse)
                .password("password123")
                .status(true)
                .build();
    }

    @Test
    @DisplayName("Should get all clients successfully")
    void shouldGetAllClientsSuccessfully() throws Exception {
        // Given
        List<Client> clients = List.of(validClient);
        List<ClientListResponse> clientListResponses = List.of(validClientListResponse);

        when(clientUseCase.getAllClients()).thenReturn(clients);
        when(clientRestMapper.toListResponseList(clients)).thenReturn(clientListResponses);

        // When & Then
        mockMvc.perform(get("/client"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].person.fullName").value("Juan Pérez García"))
                .andExpect(jsonPath("$[0].person.address").value("Av. Principal 123"))
                .andExpect(jsonPath("$[0].person.phone").value("+593-99-123-4567"))
                .andExpect(jsonPath("$[0].password").value("password123"))
                .andExpect(jsonPath("$[0].status").value(true));

        verify(clientUseCase).getAllClients();
        verify(clientRestMapper).toListResponseList(clients);
    }

    @Test
    @DisplayName("Should create client successfully with valid data")
    void shouldCreateClientSuccessfullyWithValidData() throws Exception {
        // Given
        when(clientRestMapper.toDomain(any(ClientRequest.class))).thenReturn(validClient);
        when(clientUseCase.createClient(any(Client.class))).thenReturn(validClient);
        when(clientRestMapper.toResponse(any(Client.class))).thenReturn(validClientResponse);

        // When & Then
        mockMvc.perform(post("/client")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validClientRequest)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.clientId").value(1L))
                .andExpect(jsonPath("$.person.fullName").value("Juan Pérez García"))
                .andExpect(jsonPath("$.person.identification").value("1234567890"))
                .andExpect(jsonPath("$.status").value(true));

        verify(clientRestMapper).toDomain(any(ClientRequest.class));
        verify(clientUseCase).createClient(any(Client.class));
        verify(clientRestMapper).toResponse(any(Client.class));
    }

    @Test
    @DisplayName("Should return 400 when creating client with invalid data")
    void shouldReturn400WhenCreatingClientWithInvalidData() throws Exception {
        // Given
        ClientRequest invalidRequest = ClientRequest.builder()
                .person(PersonRequest.builder()
                        .fullName("")  // Empty name
                        .gender(Gender.HOMBRE)
                        .age(-1)  // Negative age
                        .identification("")  // Empty identification
                        .build())
                .password("123")  // Too short
                .build();

        // When & Then
        mockMvc.perform(post("/client")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Validation Failed"));

        verify(clientUseCase, never()).createClient(any(Client.class));
    }

    @Test
    @DisplayName("Should return 409 when creating client with existing identification")
    void shouldReturn409WhenCreatingClientWithExistingIdentification() throws Exception {
        // Given
        when(clientRestMapper.toDomain(any(ClientRequest.class))).thenReturn(validClient);
        when(clientUseCase.createClient(any(Client.class)))
                .thenThrow(ClientAlreadyExistsException.byIdentification("1234567890"));

        // When & Then
        mockMvc.perform(post("/client")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validClientRequest)))
                .andExpect(status().isConflict())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.error").value("Client Already Exists"))
                .andExpect(jsonPath("$.message").value("Client with identification '1234567890' already exists"));

        verify(clientRestMapper).toDomain(any(ClientRequest.class));
        verify(clientUseCase).createClient(any(Client.class));
        verify(clientRestMapper, never()).toResponse(any(Client.class));
    }

    @Test
    @DisplayName("Should get client by id successfully")
    void shouldGetClientByIdSuccessfully() throws Exception {
        // Given
        Long clientId = 1L;
        when(clientUseCase.getClientById(clientId)).thenReturn(validClient);
        when(clientRestMapper.toResponse(validClient)).thenReturn(validClientResponse);

        // When & Then
        mockMvc.perform(get("/client/{id}", clientId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.clientId").value(1L))
                .andExpect(jsonPath("$.person.fullName").value("Juan Pérez García"))
                .andExpect(jsonPath("$.person.identification").value("1234567890"))
                .andExpect(jsonPath("$.status").value(true));

        verify(clientUseCase).getClientById(clientId);
        verify(clientRestMapper).toResponse(validClient);
    }

    @Test
    @DisplayName("Should return 404 when client not found by id")
    void shouldReturn404WhenClientNotFoundById() throws Exception {
        // Given
        Long clientId = 999L;
        when(clientUseCase.getClientById(clientId))
                .thenThrow(ClientNotFoundException.byId(clientId));

        // When & Then
        mockMvc.perform(get("/client/{id}", clientId))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Client Not Found"))
                .andExpect(jsonPath("$.message").value("Client with id '999' was not found"));

        verify(clientUseCase).getClientById(clientId);
        verify(clientRestMapper, never()).toResponse(any(Client.class));
    }

    @Test
    @DisplayName("Should update client successfully")
    void shouldUpdateClientSuccessfully() throws Exception {
        // Given
        Long clientId = 1L;
        when(clientRestMapper.toDomain(any(ClientRequest.class))).thenReturn(validClient);
        when(clientUseCase.updateClient(eq(clientId), any(Client.class))).thenReturn(validClient);
        when(clientRestMapper.toResponse(any(Client.class))).thenReturn(validClientResponse);

        // When & Then
        mockMvc.perform(put("/client/{id}", clientId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validClientRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.clientId").value(1L))
                .andExpect(jsonPath("$.person.fullName").value("Juan Pérez García"))
                .andExpect(jsonPath("$.status").value(true));

        verify(clientRestMapper).toDomain(any(ClientRequest.class));
        verify(clientUseCase).updateClient(eq(clientId), any(Client.class));
        verify(clientRestMapper).toResponse(any(Client.class));
    }

    @Test
    @DisplayName("Should return 404 when updating non-existing client")
    void shouldReturn404WhenUpdatingNonExistingClient() throws Exception {
        // Given
        Long clientId = 999L;
        when(clientRestMapper.toDomain(any(ClientRequest.class))).thenReturn(validClient);
        when(clientUseCase.updateClient(eq(clientId), any(Client.class)))
                .thenThrow(ClientNotFoundException.byId(clientId));

        // When & Then
        mockMvc.perform(put("/client/{id}", clientId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validClientRequest)))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Client Not Found"));

        verify(clientRestMapper).toDomain(any(ClientRequest.class));
        verify(clientUseCase).updateClient(eq(clientId), any(Client.class));
        verify(clientRestMapper, never()).toResponse(any(Client.class));
    }

    @Test
    @DisplayName("Should delete client successfully")
    void shouldDeleteClientSuccessfully() throws Exception {
        // Given
        Long clientId = 1L;
        doNothing().when(clientUseCase).deleteClient(clientId);

        // When & Then
        mockMvc.perform(delete("/client/{id}", clientId))
                .andExpect(status().isNoContent());

        verify(clientUseCase).deleteClient(clientId);
    }

    @Test
    @DisplayName("Should return 404 when deleting non-existing client")
    void shouldReturn404WhenDeletingNonExistingClient() throws Exception {
        // Given
        Long clientId = 999L;
        doThrow(ClientNotFoundException.byId(clientId))
                .when(clientUseCase).deleteClient(clientId);

        // When & Then
        mockMvc.perform(delete("/client/{id}", clientId))
                .andExpect(status().isNotFound())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("Client Not Found"));

        verify(clientUseCase).deleteClient(clientId);
    }
}