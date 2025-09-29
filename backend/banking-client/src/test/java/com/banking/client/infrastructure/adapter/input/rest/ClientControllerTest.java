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

import com.banking.client.domain.model.Gender;

import com.banking.client.domain.exception.ClientAlreadyExistsException;import com.banking.client.domain.model.Person;g.client.infrastructure.adapter.input.rest;

import com.banking.client.domain.exception.ClientNotFoundException;

import com.banking.client.domain.model.Client;import com.banking.client.domain.exception.ClientAlreadyExistsException;

import com.banking.client.domain.model.Gender;import com.banking.client.domain.exception.ClientNotFoundException;

import com.banking.client.domain.model.Person;import com.banking.client.domain.model.Client;

import com.banking.client.domain.port.input.ClientUseCase;                .andExpect(status().isOk())

import com.banking.client.infrastructure.adapter.input.rest.dto.ClientRequest;                .andExpect(content().contentType(MediaType.APPLICATION_JSON))

import com.banking.client.infrastructure.adapter.input.rest.dto.ClientResponse;                .andExpect(jsonPath("$").isArray())

import com.banking.client.infrastructure.adapter.input.rest.dto.ClientListResponse;                .andExpected(jsonPath("$[0].person.fullName").value("Juan Pérez García"))

import com.banking.client.infrastructure.adapter.input.rest.dto.PersonRequest;                .andExpect(jsonPath("$[0].person.address").value("Av. Principal 123"))

import com.banking.client.infrastructure.adapter.input.rest.dto.PersonResponse;                .andExpect(jsonPath("$[0].person.phone").value("+593-99-123-4567"))

import com.banking.client.infrastructure.adapter.input.rest.dto.PersonListResponse;                .andExpect(jsonPath("$[0].password").value("password123"))

import com.banking.client.infrastructure.adapter.input.rest.mapper.ClientRestMapper;                .andExpect(jsonPath("$[0].status").value(true));

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;        verify(clientUseCase).getAllClients();

import org.junit.jupiter.api.DisplayName;        verify(clientRestMapper).toListResponseList(clients);

import org.junit.jupiter.api.Test;    }g.client.domain.model.Gender;

import org.springframework.beans.factory.annotation.Autowired;import com.banking.client.domain.model.Person;

import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;import com.banking.client.domain.port.input.ClientUseCase;

import org.springframework.boot.test.mock.mockito.MockBean;import com.banking.client.infrastructure.adapter.input.rest.dto.ClientRequest;

import org.springframework.http.MediaType;import com.banking.client.infrastructure.adapter.input.rest.dto.ClientResponse;

import org.springframework.test.web.servlet.MockMvc;import com.banking.client.infrastructure.adapter.input.rest.dto.ClientListResponse;

import com.banking.client.infrastructure.adapter.input.rest.dto.PersonRequest;

import java.util.List;import com.banking.client.infrastructure.adapter.input.rest.dto.PersonResponse;

import com.banking.client.infrastructure.adapter.input.rest.dto.PersonListResponse;

import static org.mockito.ArgumentMatchers.any;import com.banking.client.infrastructure.adapter.input.rest.mapper.ClientRestMapper;

import static org.mockito.Mockito.*;import com.fasterxml.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;import org.junit.jupiter.api.Test;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;import org.junit.jupiter.api.DisplayName;

import org.junit.jupiter.api.BeforeEach;

@WebMvcTest(ClientController.class)import org.springframework.beans.factory.annotation.Autowired;

class ClientControllerTest {import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.boot.test.mock.mockito.MockBean;

    @Autowiredimport org.springframework.http.MediaType;

    private MockMvc mockMvc;import org.springframework.test.web.servlet.MockMvc;



    @MockBeanimport java.util.Arrays;

    private ClientUseCase clientUseCase;import java.util.List;



    @MockBeanimport static org.mockito.ArgumentMatchers.*;

    private ClientRestMapper clientRestMapper;import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

    @Autowiredimport static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

    private ObjectMapper objectMapper;

/**

    private Person validPerson; * Unit tests for ClientController

    private Client validClient; */

    private PersonRequest validPersonRequest;@WebMvcTest(ClientController.class)

    private ClientRequest validClientRequest;class ClientControllerTest {

    private PersonResponse validPersonResponse;

    private ClientResponse validClientResponse;    @Autowired

    private PersonListResponse validPersonListResponse;    private MockMvc mockMvc;

    private ClientListResponse validClientListResponse;

    @MockBean

    @BeforeEach    private ClientUseCase clientUseCase;

    void setUp() {

        validPerson = Person.builder()    @MockBean

                .personId(1L)    private ClientRestMapper clientRestMapper;

                .fullName("Juan Pérez García")

                .gender(Gender.HOMBRE)    @Autowired

                .age(30)    private ObjectMapper objectMapper;

                .identification("1234567890")

                .address("Av. Principal 123")    private Person validPerson;

                .phone("+593-99-123-4567")    private Client validClient;

                .build();    private PersonRequest validPersonRequest;

    private ClientRequest validClientRequest;

        validClient = Client.builder()    private PersonResponse validPersonResponse;

                .clientId(1L)    private ClientResponse validClientResponse;

                .person(validPerson)    private PersonListResponse validPersonListResponse;

                .password("password123")    private ClientListResponse validClientListResponse;

                .status(true)

                .build();    @BeforeEach

    void setUp() {

        validPersonRequest = PersonRequest.builder()        validPerson = Person.builder()

                .fullName("Juan Pérez García")                .personId(1L)

                .gender(Gender.HOMBRE)                .fullName("Juan Pérez García")

                .age(30)                .gender(Gender.HOMBRE)

                .identification("1234567890")                .age(30)

                .address("Av. Principal 123")                .identification("1234567890")

                .phone("+593-99-123-4567")                .address("Av. Principal 123")

                .build();                .phone("+593-99-123-4567")

                .build();

        validClientRequest = ClientRequest.builder()

                .person(validPersonRequest)        validClient = Client.builder()

                .password("password123")                .clientId(1L)

                .status(true)                .person(validPerson)

                .build();                .password("password123")

                .status(true)

        validPersonResponse = PersonResponse.builder()                .build();

                .personId(1L)

                .fullName("Juan Pérez García")        validPersonRequest = PersonRequest.builder()

                .gender(Gender.HOMBRE)                .fullName("Juan Pérez García")

                .age(30)                .gender(Gender.HOMBRE)

                .identification("1234567890")                .age(30)

                .address("Av. Principal 123")                .identification("1234567890")

                .phone("+593-99-123-4567")                .address("Av. Principal 123")

                .build();                .phone("+593-99-123-4567")

                .build();

        validClientResponse = ClientResponse.builder()

                .clientId(1L)        validClientRequest = ClientRequest.builder()

                .person(validPersonResponse)                .person(validPersonRequest)

                .status(true)                .password("password123")

                .build();                .status(true)

                .build();

        validPersonListResponse = PersonListResponse.builder()

                .fullName("Juan Pérez García")        validPersonResponse = PersonResponse.builder()

                .address("Av. Principal 123")                .personId(1L)

                .phone("+593-99-123-4567")                .fullName("Juan Pérez García")

                .build();                .gender(Gender.HOMBRE)

                .age(30)

        validClientListResponse = ClientListResponse.builder()                .identification("1234567890")

                .person(validPersonListResponse)                .address("Av. Principal 123")

                .password("password123")                .phone("+593-99-123-4567")

                .status(true)                .build();

                .build();

    }        validClientResponse = ClientResponse.builder()

                .clientId(1L)

    @Test                .person(validPersonResponse)

    @DisplayName("Should get all clients successfully")                .status(true)

    void shouldGetAllClientsSuccessfully() throws Exception {                .build();

        // Given

        List<Client> clients = List.of(validClient);        validPersonListResponse = PersonListResponse.builder()

        List<ClientListResponse> clientListResponses = List.of(validClientListResponse);                .fullName("Juan Pérez García")

                .address("Av. Principal 123")

        when(clientUseCase.getAllClients()).thenReturn(clients);                .phone("+593-99-123-4567")

        when(clientRestMapper.toListResponseList(clients)).thenReturn(clientListResponses);                .build();



        // When & Then        validClientListResponse = ClientListResponse.builder()

        mockMvc.perform(get("/client"))                .person(validPersonListResponse)

                .andExpect(status().isOk())                .password("password123")

                .andExpect(content().contentType(MediaType.APPLICATION_JSON))                .status(true)

                .andExpect(jsonPath("$").isArray())                .build();

                .andExpect(jsonPath("$[0].person.fullName").value("Juan Pérez García"))    }

                .andExpect(jsonPath("$[0].person.address").value("Av. Principal 123"))

                .andExpect(jsonPath("$[0].person.phone").value("+593-99-123-4567"))    @Test

                .andExpect(jsonPath("$[0].password").value("password123"))    @DisplayName("Should create client successfully with valid data")

                .andExpected(jsonPath("$[0].status").value(true));    void shouldCreateClientSuccessfullyWithValidData() throws Exception {

        // Given

        verify(clientUseCase).getAllClients();        when(clientRestMapper.toDomain(any(ClientRequest.class))).thenReturn(validClient);

        verify(clientRestMapper).toListResponseList(clients);        when(clientUseCase.createClient(any(Client.class))).thenReturn(validClient);

    }        when(clientRestMapper.toResponse(any(Client.class))).thenReturn(validClientResponse);



    @Test        // When & Then

    @DisplayName("Should create client successfully with valid data")        mockMvc.perform(post("/client")

    void shouldCreateClientSuccessfullyWithValidData() throws Exception {                        .contentType(MediaType.APPLICATION_JSON)

        // Given                        .content(objectMapper.writeValueAsString(validClientRequest)))

        when(clientRestMapper.toDomain(any(ClientRequest.class))).thenReturn(validClient);                .andExpect(status().isCreated())

        when(clientUseCase.createClient(any(Client.class))).thenReturn(validClient);                .andExpect(content().contentType(MediaType.APPLICATION_JSON))

        when(clientRestMapper.toResponse(any(Client.class))).thenReturn(validClientResponse);                .andExpect(jsonPath("$.clientId").value(1L))

                .andExpect(jsonPath("$.person.fullName").value("Juan Pérez García"))

        // When & Then                .andExpect(jsonPath("$.person.identification").value("1234567890"))

        mockMvc.perform(post("/client")                .andExpect(jsonPath("$.status").value(true));

                        .contentType(MediaType.APPLICATION_JSON)

                        .content(objectMapper.writeValueAsString(validClientRequest)))        verify(clientRestMapper).toDomain(any(ClientRequest.class));

                .andExpect(status().isCreated())        verify(clientUseCase).createClient(any(Client.class));

                .andExpect(content().contentType(MediaType.APPLICATION_JSON))        verify(clientRestMapper).toResponse(any(Client.class));

                .andExpect(jsonPath("$.clientId").value(1L))    }

                .andExpect(jsonPath("$.person.fullName").value("Juan Pérez García"))

                .andExpect(jsonPath("$.person.identification").value("1234567890"))    @Test

                .andExpect(jsonPath("$.status").value(true));    @DisplayName("Should return 400 when creating client with invalid data")

    void shouldReturn400WhenCreatingClientWithInvalidData() throws Exception {

        verify(clientRestMapper).toDomain(any(ClientRequest.class));        // Given

        verify(clientUseCase).createClient(any(Client.class));        ClientRequest invalidRequest = ClientRequest.builder()

        verify(clientRestMapper).toResponse(any(Client.class));                .person(PersonRequest.builder()

    }                        .fullName("")  // Empty name

                        .gender(Gender.HOMBRE)

    @Test                        .age(-1)  // Negative age

    @DisplayName("Should return 400 when creating client with invalid data")                        .identification("")  // Empty identification

    void shouldReturn400WhenCreatingClientWithInvalidData() throws Exception {                        .build())

        // Given                .password("123")  // Too short

        ClientRequest invalidRequest = ClientRequest.builder()                .build();

                .person(PersonRequest.builder()

                        .fullName("")  // Empty name        // When & Then

                        .gender(Gender.HOMBRE)        mockMvc.perform(post("/client")

                        .age(-1)  // Negative age                        .contentType(MediaType.APPLICATION_JSON)

                        .identification("")  // Empty identification                        .content(objectMapper.writeValueAsString(invalidRequest)))

                        .build())                .andExpect(status().isBadRequest())

                .password("123")  // Too short                .andExpect(content().contentType(MediaType.APPLICATION_JSON))

                .build();                .andExpect(jsonPath("$.status").value(400))

                .andExpect(jsonPath("$.error").value("Validation Failed"));

        // When & Then

        mockMvc.perform(post("/client")        verify(clientUseCase, never()).createClient(any(Client.class));

                        .contentType(MediaType.APPLICATION_JSON)    }

                        .content(objectMapper.writeValueAsString(invalidRequest)))

                .andExpect(status().isBadRequest())    @Test

                .andExpect(content().contentType(MediaType.APPLICATION_JSON))    @DisplayName("Should return 409 when creating client with existing identification")

                .andExpect(jsonPath("$.status").value(400))    void shouldReturn409WhenCreatingClientWithExistingIdentification() throws Exception {

                .andExpect(jsonPath("$.error").value("Validation Failed"));        // Given

        when(clientRestMapper.toDomain(any(ClientRequest.class))).thenReturn(validClient);

        verify(clientUseCase, never()).createClient(any(Client.class));        when(clientUseCase.createClient(any(Client.class)))

    }                .thenThrow(ClientAlreadyExistsException.byIdentification("1234567890"));



    @Test        // When & Then

    @DisplayName("Should return 409 when creating client with existing identification")        mockMvc.perform(post("/client")

    void shouldReturn409WhenCreatingClientWithExistingIdentification() throws Exception {                        .contentType(MediaType.APPLICATION_JSON)

        // Given                        .content(objectMapper.writeValueAsString(validClientRequest)))

        when(clientRestMapper.toDomain(any(ClientRequest.class))).thenReturn(validClient);                .andExpect(status().isConflict())

        when(clientUseCase.createClient(any(Client.class)))                .andExpect(content().contentType(MediaType.APPLICATION_JSON))

                .thenThrow(ClientAlreadyExistsException.byIdentification("1234567890"));                .andExpect(jsonPath("$.status").value(409))

                .andExpect(jsonPath("$.error").value("Conflict"))

        // When & Then                .andExpect(jsonPath("$.message").value("Client already exists with identification: 1234567890"));

        mockMvc.perform(post("/client")

                        .contentType(MediaType.APPLICATION_JSON)        verify(clientUseCase).createClient(any(Client.class));

                        .content(objectMapper.writeValueAsString(validClientRequest)))    }

                .andExpect(status().isConflict())

                .andExpect(content().contentType(MediaType.APPLICATION_JSON))    @Test

                .andExpect(jsonPath("$.status").value(409))    @DisplayName("Should get client by ID successfully when client exists")

                .andExpect(jsonPath("$.error").value("Client Already Exists"))    void shouldGetClientByIdSuccessfullyWhenClientExists() throws Exception {

                .andExpect(jsonPath("$.message").value("Client with identification '1234567890' already exists"));        // Given

        Long clientId = 1L;

        verify(clientRestMapper).toDomain(any(ClientRequest.class));        when(clientUseCase.getClientById(clientId)).thenReturn(validClient);

        verify(clientUseCase).createClient(any(Client.class));        when(clientRestMapper.toResponse(validClient)).thenReturn(validClientResponse);

        verify(clientRestMapper, never()).toResponse(any(Client.class));

    }        // When & Then

        mockMvc.perform(get("/client/{clientId}", clientId))

    @Test                .andExpect(status().isOk())

    @DisplayName("Should get client by id successfully")                .andExpect(content().contentType(MediaType.APPLICATION_JSON))

    void shouldGetClientByIdSuccessfully() throws Exception {                .andExpect(jsonPath("$.clientId").value(1L))

        // Given                .andExpect(jsonPath("$.person.fullName").value("Juan Pérez García"))

        Long clientId = 1L;                .andExpect(jsonPath("$.person.identification").value("1234567890"));

        when(clientUseCase.getClientById(clientId)).thenReturn(validClient);

        when(clientRestMapper.toResponse(validClient)).thenReturn(validClientResponse);        verify(clientUseCase).getClientById(clientId);

        verify(clientRestMapper).toResponse(validClient);

        // When & Then    }

        mockMvc.perform(get("/client/{id}", clientId))

                .andExpect(status().isOk())    @Test

                .andExpect(content().contentType(MediaType.APPLICATION_JSON))    @DisplayName("Should return 404 when getting client by non-existent ID")

                .andExpect(jsonPath("$.clientId").value(1L))    void shouldReturn404WhenGettingClientByNonExistentId() throws Exception {

                .andExpect(jsonPath("$.person.fullName").value("Juan Pérez García"))        // Given

                .andExpect(jsonPath("$.person.identification").value("1234567890"))        Long clientId = 999L;

                .andExpect(jsonPath("$.status").value(true));        when(clientUseCase.getClientById(clientId))

                .thenThrow(ClientNotFoundException.byId(clientId));

        verify(clientUseCase).getClientById(clientId);

        verify(clientRestMapper).toResponse(validClient);        // When & Then

    }        mockMvc.perform(get("/client/{clientId}", clientId))

                .andExpect(status().isNotFound())

    @Test                .andExpect(content().contentType(MediaType.APPLICATION_JSON))

    @DisplayName("Should return 404 when client not found by id")                .andExpect(jsonPath("$.status").value(404))

    void shouldReturn404WhenClientNotFoundById() throws Exception {                .andExpect(jsonPath("$.error").value("Not Found"))

        // Given                .andExpect(jsonPath("$.message").value("Client not found with ID: 999"));

        Long clientId = 999L;

        when(clientUseCase.getClientById(clientId))        verify(clientUseCase).getClientById(clientId);

                .thenThrow(ClientNotFoundException.byId(clientId));        verify(clientRestMapper, never()).toResponse(any(Client.class));

    }

        // When & Then

        mockMvc.perform(get("/client/{id}", clientId))    @Test

                .andExpect(status().isNotFound())    @DisplayName("Should get client by identification successfully when client exists")

                .andExpect(content().contentType(MediaType.APPLICATION_JSON))    void shouldGetClientByIdentificationSuccessfullyWhenClientExists() throws Exception {

                .andExpect(jsonPath("$.status").value(404))        // Given

                .andExpect(jsonPath("$.error").value("Client Not Found"))        String identification = "1234567890";

                .andExpect(jsonPath("$.message").value("Client with id '999' was not found"));        when(clientUseCase.getClientByIdentification(identification)).thenReturn(validClient);

        when(clientRestMapper.toResponse(validClient)).thenReturn(validClientResponse);

        verify(clientUseCase).getClientById(clientId);

        verify(clientRestMapper, never()).toResponse(any(Client.class));        // When & Then

    }        mockMvc.perform(get("/client/identification/{identification}", identification))

                .andExpect(status().isOk())

    @Test                .andExpect(content().contentType(MediaType.APPLICATION_JSON))

    @DisplayName("Should update client successfully")                .andExpect(jsonPath("$.clientId").value(1L))

    void shouldUpdateClientSuccessfully() throws Exception {                .andExpect(jsonPath("$.person.identification").value(identification));

        // Given

        Long clientId = 1L;        verify(clientUseCase).getClientByIdentification(identification);

        when(clientRestMapper.toDomain(any(ClientRequest.class))).thenReturn(validClient);        verify(clientRestMapper).toResponse(validClient);

        when(clientUseCase.updateClient(eq(clientId), any(Client.class))).thenReturn(validClient);    }

        when(clientRestMapper.toResponse(any(Client.class))).thenReturn(validClientResponse);

    @Test

        // When & Then    @DisplayName("Should get all clients successfully")

        mockMvc.perform(put("/client/{id}", clientId)    void shouldGetAllClientsSuccessfully() throws Exception {

                        .contentType(MediaType.APPLICATION_JSON)        // Given

                        .content(objectMapper.writeValueAsString(validClientRequest)))        List<Client> clients = Arrays.asList(validClient);

                .andExpect(status().isOk())        List<ClientResponse> clientResponses = Arrays.asList(validClientResponse);

                .andExpect(content().contentType(MediaType.APPLICATION_JSON))        when(clientUseCase.getAllClients()).thenReturn(clients);

                .andExpect(jsonPath("$.clientId").value(1L))        when(clientRestMapper.toResponseList(clients)).thenReturn(clientResponses);

                .andExpect(jsonPath("$.person.fullName").value("Juan Pérez García"))

                .andExpect(jsonPath("$.status").value(true));        // When & Then

        mockMvc.perform(get("/client"))

        verify(clientRestMapper).toDomain(any(ClientRequest.class));                .andExpect(status().isOk())

        verify(clientUseCase).updateClient(eq(clientId), any(Client.class));                .andExpect(content().contentType(MediaType.APPLICATION_JSON))

        verify(clientRestMapper).toResponse(any(Client.class));                .andExpect(jsonPath("$").isArray())

    }                .andExpect(jsonPath("$[0].clientId").value(1L))

                .andExpect(jsonPath("$[0].person.fullName").value("Juan Pérez García"));

    @Test

    @DisplayName("Should return 404 when updating non-existing client")        verify(clientUseCase).getAllClients();

    void shouldReturn404WhenUpdatingNonExistingClient() throws Exception {        verify(clientRestMapper).toResponseList(clients);

        // Given    }

        Long clientId = 999L;

        when(clientRestMapper.toDomain(any(ClientRequest.class))).thenReturn(validClient);    @Test

        when(clientUseCase.updateClient(eq(clientId), any(Client.class)))    @DisplayName("Should get active clients only when status filter is active")

                .thenThrow(ClientNotFoundException.byId(clientId));    void shouldGetActiveClientsOnlyWhenStatusFilterIsActive() throws Exception {

        // Given

        // When & Then        List<Client> activeClients = Arrays.asList(validClient);

        mockMvc.perform(put("/client/{id}", clientId)        List<ClientResponse> activeClientResponses = Arrays.asList(validClientResponse);

                        .contentType(MediaType.APPLICATION_JSON)        when(clientUseCase.getActiveClients()).thenReturn(activeClients);

                        .content(objectMapper.writeValueAsString(validClientRequest)))        when(clientRestMapper.toResponseList(activeClients)).thenReturn(activeClientResponses);

                .andExpect(status().isNotFound())

                .andExpect(content().contentType(MediaType.APPLICATION_JSON))        // When & Then

                .andExpect(jsonPath("$.status").value(404))        mockMvc.perform(get("/client").param("status", "active"))

                .andExpect(jsonPath("$.error").value("Client Not Found"));                .andExpect(status().isOk())

                .andExpect(content().contentType(MediaType.APPLICATION_JSON))

        verify(clientRestMapper).toDomain(any(ClientRequest.class));                .andExpect(jsonPath("$").isArray())

        verify(clientUseCase).updateClient(eq(clientId), any(Client.class));                .andExpect(jsonPath("$[0].clientId").value(1L))

        verify(clientRestMapper, never()).toResponse(any(Client.class));                .andExpect(jsonPath("$[0].status").value(true));

    }

        verify(clientUseCase).getActiveClients();

    @Test        verify(clientUseCase, never()).getAllClients();

    @DisplayName("Should delete client successfully")        verify(clientRestMapper).toResponseList(activeClients);

    void shouldDeleteClientSuccessfully() throws Exception {    }

        // Given

        Long clientId = 1L;    @Test

        doNothing().when(clientUseCase).deleteClient(clientId);    @DisplayName("Should update client successfully with valid data")

    void shouldUpdateClientSuccessfullyWithValidData() throws Exception {

        // When & Then        // Given

        mockMvc.perform(delete("/client/{id}", clientId))        Long clientId = 1L;

                .andExpect(status().isNoContent());        Client updatedClient = Client.builder()

                .clientId(clientId)

        verify(clientUseCase).deleteClient(clientId);                .person(validPerson)

    }                .password("newPassword123")

                .status(true)

    @Test                .build();

    @DisplayName("Should return 404 when deleting non-existing client")

    void shouldReturn404WhenDeletingNonExistingClient() throws Exception {        ClientResponse updatedResponse = ClientResponse.builder()

        // Given                .clientId(clientId)

        Long clientId = 999L;                .person(validPersonResponse)

        doThrow(ClientNotFoundException.byId(clientId))                .status(true)

                .when(clientUseCase).deleteClient(clientId);                .build();



        // When & Then        when(clientRestMapper.toDomain(any(ClientRequest.class))).thenReturn(validClient);

        mockMvc.perform(delete("/client/{id}", clientId))        when(clientUseCase.updateClient(eq(clientId), any(Client.class))).thenReturn(updatedClient);

                .andExpect(status().isNotFound())        when(clientRestMapper.toResponse(updatedClient)).thenReturn(updatedResponse);

                .andExpect(content().contentType(MediaType.APPLICATION_JSON))

                .andExpect(jsonPath("$.status").value(404))        // When & Then

                .andExpect(jsonPath("$.error").value("Client Not Found"));        mockMvc.perform(put("/client/{clientId}", clientId)

                        .contentType(MediaType.APPLICATION_JSON)

        verify(clientUseCase).deleteClient(clientId);                        .content(objectMapper.writeValueAsString(validClientRequest)))

    }                .andExpect(status().isOk())

}                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.clientId").value(clientId));

        verify(clientRestMapper).toDomain(any(ClientRequest.class));
        verify(clientUseCase).updateClient(eq(clientId), any(Client.class));
        verify(clientRestMapper).toResponse(updatedClient);
    }

    @Test
    @DisplayName("Should delete client successfully when client exists")
    void shouldDeleteClientSuccessfullyWhenClientExists() throws Exception {
        // Given
        Long clientId = 1L;

        // When & Then
        mockMvc.perform(delete("/client/{clientId}", clientId))
                .andExpect(status().isNoContent());

        verify(clientUseCase).deleteClient(clientId);
    }

    @Test
    @DisplayName("Should activate client successfully when client exists")
    void shouldActivateClientSuccessfullyWhenClientExists() throws Exception {
        // Given
        Long clientId = 1L;
        when(clientUseCase.activateClient(clientId)).thenReturn(validClient);
        when(clientRestMapper.toResponse(validClient)).thenReturn(validClientResponse);

        // When & Then
        mockMvc.perform(patch("/client/{clientId}/activate", clientId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.clientId").value(clientId))
                .andExpect(jsonPath("$.status").value(true));

        verify(clientUseCase).activateClient(clientId);
        verify(clientRestMapper).toResponse(validClient);
    }

    @Test
    @DisplayName("Should deactivate client successfully when client exists")
    void shouldDeactivateClientSuccessfullyWhenClientExists() throws Exception {
        // Given
        Long clientId = 1L;
        Client deactivatedClient = Client.builder()
                .clientId(clientId)
                .person(validPerson)
                .password("password123")
                .status(false)
                .build();

        ClientResponse deactivatedResponse = ClientResponse.builder()
                .clientId(clientId)
                .person(validPersonResponse)
                .status(false)
                .build();

        when(clientUseCase.deactivateClient(clientId)).thenReturn(deactivatedClient);
        when(clientRestMapper.toResponse(deactivatedClient)).thenReturn(deactivatedResponse);

        // When & Then
        mockMvc.perform(patch("/client/{clientId}/deactivate", clientId))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.clientId").value(clientId))
                .andExpect(jsonPath("$.status").value(false));

        verify(clientUseCase).deactivateClient(clientId);
        verify(clientRestMapper).toResponse(deactivatedClient);
    }
}