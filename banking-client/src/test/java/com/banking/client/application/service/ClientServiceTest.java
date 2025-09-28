package com.banking.client.application.service;

import com.banking.client.domain.exception.ClientAlreadyExistsException;
import com.banking.client.domain.exception.ClientNotFoundException;
import com.banking.client.domain.exception.InvalidClientDataException;
import com.banking.client.domain.model.Client;
import com.banking.client.domain.model.Gender;
import com.banking.client.domain.model.Person;
import com.banking.client.domain.port.output.ClientRepositoryPort;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ClientService
 */
@ExtendWith(MockitoExtension.class)
class ClientServiceTest {

    @Mock
    private ClientRepositoryPort clientRepositoryPort;

    @InjectMocks
    private ClientService clientService;

    private Person validPerson;
    private Client validClient;

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
    }

    @Test
    @DisplayName("Should create client successfully when valid data provided")
    void shouldCreateClientSuccessfullyWhenValidDataProvided() {
        // Given
        Client clientToCreate = Client.builder()
                .person(validPerson)
                .password("password123")
                .status(null) // Will be set to true by service
                .build();

        when(clientRepositoryPort.existsByPersonIdentification("1234567890")).thenReturn(false);
        when(clientRepositoryPort.save(any(Client.class))).thenReturn(validClient);

        // When
        Client createdClient = clientService.createClient(clientToCreate);

        // Then
        assertNotNull(createdClient);
        assertEquals(1L, createdClient.getClientId());
        assertEquals("Juan Pérez García", createdClient.getFullName());
        assertTrue(createdClient.getStatus());

        verify(clientRepositoryPort).existsByPersonIdentification("1234567890");
        verify(clientRepositoryPort).save(any(Client.class));
    }

    @Test
    @DisplayName("Should set default status to true when not provided")
    void shouldSetDefaultStatusToTrueWhenNotProvided() {
        // Given
        Client clientToCreate = Client.builder()
                .person(validPerson)
                .password("password123")
                .status(null)
                .build();

        when(clientRepositoryPort.existsByPersonIdentification(anyString())).thenReturn(false);
        when(clientRepositoryPort.save(any(Client.class))).thenAnswer(invocation -> {
            Client savedClient = invocation.getArgument(0);
            return Client.builder()
                    .clientId(1L)
                    .person(savedClient.getPerson())
                    .password(savedClient.getPassword())
                    .status(savedClient.getStatus())
                    .build();
        });

        // When
        Client createdClient = clientService.createClient(clientToCreate);

        // Then
        assertTrue(createdClient.getStatus());
        verify(clientRepositoryPort).save(argThat(client -> client.getStatus().equals(true)));
    }

    @Test
    @DisplayName("Should throw InvalidClientDataException when client data is invalid")
    void shouldThrowInvalidClientDataExceptionWhenClientDataIsInvalid() {
        // Given
        Client invalidClient = Client.builder()
                .person(validPerson)
                .password("123") // Too short
                .status(true)
                .build();

        // When & Then
        InvalidClientDataException exception = assertThrows(
                InvalidClientDataException.class,
                () -> clientService.createClient(invalidClient)
        );

        assertEquals("Client data is invalid", exception.getMessage());
        verify(clientRepositoryPort, never()).existsByPersonIdentification(anyString());
        verify(clientRepositoryPort, never()).save(any(Client.class));
    }

    @Test
    @DisplayName("Should throw ClientAlreadyExistsException when identification already exists")
    void shouldThrowClientAlreadyExistsExceptionWhenIdentificationAlreadyExists() {
        // Given
        Client clientToCreate = Client.builder()
                .person(validPerson)
                .password("password123")
                .status(true)
                .build();

        when(clientRepositoryPort.existsByPersonIdentification("1234567890")).thenReturn(true);

        // When & Then
        ClientAlreadyExistsException exception = assertThrows(
                ClientAlreadyExistsException.class,
                () -> clientService.createClient(clientToCreate)
        );

        assertTrue(exception.getMessage().contains("1234567890"));
        verify(clientRepositoryPort).existsByPersonIdentification("1234567890");
        verify(clientRepositoryPort, never()).save(any(Client.class));
    }

    @Test
    @DisplayName("Should get client by ID successfully when client exists")
    void shouldGetClientByIdSuccessfullyWhenClientExists() {
        // Given
        Long clientId = 1L;
        when(clientRepositoryPort.findById(clientId)).thenReturn(Optional.of(validClient));

        // When
        Client foundClient = clientService.getClientById(clientId);

        // Then
        assertNotNull(foundClient);
        assertEquals(clientId, foundClient.getClientId());
        assertEquals("Juan Pérez García", foundClient.getFullName());

        verify(clientRepositoryPort).findById(clientId);
    }

    @Test
    @DisplayName("Should throw ClientNotFoundException when client ID does not exist")
    void shouldThrowClientNotFoundExceptionWhenClientIdDoesNotExist() {
        // Given
        Long clientId = 999L;
        when(clientRepositoryPort.findById(clientId)).thenReturn(Optional.empty());

        // When & Then
        ClientNotFoundException exception = assertThrows(
                ClientNotFoundException.class,
                () -> clientService.getClientById(clientId)
        );

        assertTrue(exception.getMessage().contains("999"));
        verify(clientRepositoryPort).findById(clientId);
    }

    @Test
    @DisplayName("Should get client by identification successfully when client exists")
    void shouldGetClientByIdentificationSuccessfullyWhenClientExists() {
        // Given
        String identification = "1234567890";
        when(clientRepositoryPort.findByPersonIdentification(identification)).thenReturn(Optional.of(validClient));

        // When
        Client foundClient = clientService.getClientByIdentification(identification);

        // Then
        assertNotNull(foundClient);
        assertEquals(identification, foundClient.getIdentification());
        assertEquals("Juan Pérez García", foundClient.getFullName());

        verify(clientRepositoryPort).findByPersonIdentification(identification);
    }

    @Test
    @DisplayName("Should throw ClientNotFoundException when identification does not exist")
    void shouldThrowClientNotFoundExceptionWhenIdentificationDoesNotExist() {
        // Given
        String identification = "9999999999";
        when(clientRepositoryPort.findByPersonIdentification(identification)).thenReturn(Optional.empty());

        // When & Then
        ClientNotFoundException exception = assertThrows(
                ClientNotFoundException.class,
                () -> clientService.getClientByIdentification(identification)
        );

        assertTrue(exception.getMessage().contains(identification));
        verify(clientRepositoryPort).findByPersonIdentification(identification);
    }

    @Test
    @DisplayName("Should get all clients successfully")
    void shouldGetAllClientsSuccessfully() {
        // Given
        List<Client> expectedClients = Arrays.asList(validClient);
        when(clientRepositoryPort.findAll()).thenReturn(expectedClients);

        // When
        List<Client> clients = clientService.getAllClients();

        // Then
        assertNotNull(clients);
        assertEquals(1, clients.size());
        assertEquals(validClient, clients.get(0));

        verify(clientRepositoryPort).findAll();
    }

    @Test
    @DisplayName("Should get active clients successfully")
    void shouldGetActiveClientsSuccessfully() {
        // Given
        List<Client> expectedClients = Arrays.asList(validClient);
        when(clientRepositoryPort.findAllActive()).thenReturn(expectedClients);

        // When
        List<Client> clients = clientService.getActiveClients();

        // Then
        assertNotNull(clients);
        assertEquals(1, clients.size());
        assertEquals(validClient, clients.get(0));
        assertTrue(clients.get(0).isActive());

        verify(clientRepositoryPort).findAllActive();
    }

    @Test
    @DisplayName("Should update client successfully when valid data provided")
    void shouldUpdateClientSuccessfullyWhenValidDataProvided() {
        // Given
        Long clientId = 1L;
        Client updatedClientData = Client.builder()
                .person(Person.builder()
                        .fullName("Juan Pérez Actualizado")
                        .gender(Gender.HOMBRE)
                        .age(31)
                        .identification("1234567890") // Same identification
                        .build())
                .password("newPassword123")
                .status(true)
                .build();

        Client updatedClient = Client.builder()
                .clientId(clientId)
                .person(updatedClientData.getPerson())
                .password(updatedClientData.getPassword())
                .status(updatedClientData.getStatus())
                .build();

        when(clientRepositoryPort.findById(clientId)).thenReturn(Optional.of(validClient));
        when(clientRepositoryPort.save(any(Client.class))).thenReturn(updatedClient);

        // When
        Client result = clientService.updateClient(clientId, updatedClientData);

        // Then
        assertNotNull(result);
        assertEquals(clientId, result.getClientId());
        assertEquals("Juan Pérez Actualizado", result.getFullName());

        verify(clientRepositoryPort).findById(clientId);
        verify(clientRepositoryPort).save(any(Client.class));
    }

    @Test
    @DisplayName("Should throw ClientNotFoundException when updating non-existent client")
    void shouldThrowClientNotFoundExceptionWhenUpdatingNonExistentClient() {
        // Given
        Long clientId = 999L;
        Client updatedClientData = Client.builder()
                .person(validPerson)
                .password("newPassword123")
                .status(true)
                .build();

        when(clientRepositoryPort.findById(clientId)).thenReturn(Optional.empty());

        // When & Then
        ClientNotFoundException exception = assertThrows(
                ClientNotFoundException.class,
                () -> clientService.updateClient(clientId, updatedClientData)
        );

        assertTrue(exception.getMessage().contains("999"));
        verify(clientRepositoryPort).findById(clientId);
        verify(clientRepositoryPort, never()).save(any(Client.class));
    }

    @Test
    @DisplayName("Should delete client successfully when client exists")
    void shouldDeleteClientSuccessfullyWhenClientExists() {
        // Given
        Long clientId = 1L;
        when(clientRepositoryPort.existsById(clientId)).thenReturn(true);

        // When
        clientService.deleteClient(clientId);

        // Then
        verify(clientRepositoryPort).existsById(clientId);
        verify(clientRepositoryPort).deleteById(clientId);
    }

    @Test
    @DisplayName("Should throw ClientNotFoundException when deleting non-existent client")
    void shouldThrowClientNotFoundExceptionWhenDeletingNonExistentClient() {
        // Given
        Long clientId = 999L;
        when(clientRepositoryPort.existsById(clientId)).thenReturn(false);

        // When & Then
        ClientNotFoundException exception = assertThrows(
                ClientNotFoundException.class,
                () -> clientService.deleteClient(clientId)
        );

        assertTrue(exception.getMessage().contains("999"));
        verify(clientRepositoryPort).existsById(clientId);
        verify(clientRepositoryPort, never()).deleteById(clientId);
    }

    @Test
    @DisplayName("Should activate client successfully when client exists")
    void shouldActivateClientSuccessfullyWhenClientExists() {
        // Given
        Long clientId = 1L;
        Client inactiveClient = Client.builder()
                .clientId(clientId)
                .person(validPerson)
                .password("password123")
                .status(false)
                .build();

        Client activatedClient = Client.builder()
                .clientId(clientId)
                .person(validPerson)
                .password("password123")
                .status(true)
                .build();

        when(clientRepositoryPort.findById(clientId)).thenReturn(Optional.of(inactiveClient));
        when(clientRepositoryPort.save(any(Client.class))).thenReturn(activatedClient);

        // When
        Client result = clientService.activateClient(clientId);

        // Then
        assertNotNull(result);
        assertTrue(result.isActive());
        assertEquals(clientId, result.getClientId());

        verify(clientRepositoryPort).findById(clientId);
        verify(clientRepositoryPort).save(any(Client.class));
    }

    @Test
    @DisplayName("Should deactivate client successfully when client exists")
    void shouldDeactivateClientSuccessfullyWhenClientExists() {
        // Given
        Long clientId = 1L;
        Client deactivatedClient = Client.builder()
                .clientId(clientId)
                .person(validPerson)
                .password("password123")
                .status(false)
                .build();

        when(clientRepositoryPort.findById(clientId)).thenReturn(Optional.of(validClient));
        when(clientRepositoryPort.save(any(Client.class))).thenReturn(deactivatedClient);

        // When
        Client result = clientService.deactivateClient(clientId);

        // Then
        assertNotNull(result);
        assertFalse(result.isActive());
        assertEquals(clientId, result.getClientId());

        verify(clientRepositoryPort).findById(clientId);
        verify(clientRepositoryPort).save(any(Client.class));
    }
}