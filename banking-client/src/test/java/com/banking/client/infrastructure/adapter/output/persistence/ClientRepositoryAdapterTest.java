package com.banking.client.infrastructure.adapter.output.persistence;

import com.banking.client.domain.model.Client;
import com.banking.client.domain.model.Gender;
import com.banking.client.domain.model.Person;
import com.banking.client.infrastructure.adapter.output.persistence.entity.ClientEntity;
import com.banking.client.infrastructure.adapter.output.persistence.entity.PersonEntity;
import com.banking.client.infrastructure.adapter.output.persistence.mapper.ClientPersistenceMapper;
import com.banking.client.infrastructure.adapter.output.persistence.repository.ClientJpaRepository;
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
 * Unit tests for ClientRepositoryAdapter
 */
@ExtendWith(MockitoExtension.class)
class ClientRepositoryAdapterTest {

    @Mock
    private ClientJpaRepository clientJpaRepository;

    @Mock
    private ClientPersistenceMapper clientMapper;

    @InjectMocks
    private ClientRepositoryAdapter clientRepositoryAdapter;

    private Person validPerson;
    private Client validClient;
    private PersonEntity validPersonEntity;
    private ClientEntity validClientEntity;

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

        validPersonEntity = PersonEntity.builder()
                .personId(1L)
                .fullName("Juan Pérez García")
                .gender(Gender.HOMBRE)
                .age(30)
                .identification("1234567890")
                .address("Av. Principal 123")
                .phone("+593-99-123-4567")
                .build();

        validClientEntity = ClientEntity.builder()
                .clientId(1L)
                .person(validPersonEntity)
                .password("password123")
                .status(true)
                .build();
    }

    @Test
    @DisplayName("Should save client successfully")
    void shouldSaveClientSuccessfully() {
        // Given
        when(clientMapper.toEntity(validClient)).thenReturn(validClientEntity);
        when(clientJpaRepository.save(validClientEntity)).thenReturn(validClientEntity);
        when(clientMapper.toDomain(validClientEntity)).thenReturn(validClient);

        // When
        Client savedClient = clientRepositoryAdapter.save(validClient);

        // Then
        assertNotNull(savedClient);
        assertEquals(validClient.getClientId(), savedClient.getClientId());
        assertEquals(validClient.getFullName(), savedClient.getFullName());

        verify(clientMapper).toEntity(validClient);
        verify(clientJpaRepository).save(validClientEntity);
        verify(clientMapper).toDomain(validClientEntity);
    }

    @Test
    @DisplayName("Should find client by ID when client exists")
    void shouldFindClientByIdWhenClientExists() {
        // Given
        Long clientId = 1L;
        when(clientJpaRepository.findById(clientId)).thenReturn(Optional.of(validClientEntity));
        when(clientMapper.toDomain(validClientEntity)).thenReturn(validClient);

        // When
        Optional<Client> foundClient = clientRepositoryAdapter.findById(clientId);

        // Then
        assertTrue(foundClient.isPresent());
        assertEquals(validClient.getClientId(), foundClient.get().getClientId());
        assertEquals(validClient.getFullName(), foundClient.get().getFullName());

        verify(clientJpaRepository).findById(clientId);
        verify(clientMapper).toDomain(validClientEntity);
    }

    @Test
    @DisplayName("Should return empty optional when client ID does not exist")
    void shouldReturnEmptyOptionalWhenClientIdDoesNotExist() {
        // Given
        Long clientId = 999L;
        when(clientJpaRepository.findById(clientId)).thenReturn(Optional.empty());

        // When
        Optional<Client> foundClient = clientRepositoryAdapter.findById(clientId);

        // Then
        assertFalse(foundClient.isPresent());

        verify(clientJpaRepository).findById(clientId);
        verify(clientMapper, never()).toDomain(any());
    }

    @Test
    @DisplayName("Should find client by person identification when client exists")
    void shouldFindClientByPersonIdentificationWhenClientExists() {
        // Given
        String identification = "1234567890";
        when(clientJpaRepository.findByPersonIdentification(identification)).thenReturn(Optional.of(validClientEntity));
        when(clientMapper.toDomain(validClientEntity)).thenReturn(validClient);

        // When
        Optional<Client> foundClient = clientRepositoryAdapter.findByPersonIdentification(identification);

        // Then
        assertTrue(foundClient.isPresent());
        assertEquals(validClient.getIdentification(), foundClient.get().getIdentification());
        assertEquals(validClient.getFullName(), foundClient.get().getFullName());

        verify(clientJpaRepository).findByPersonIdentification(identification);
        verify(clientMapper).toDomain(validClientEntity);
    }

    @Test
    @DisplayName("Should return empty optional when identification does not exist")
    void shouldReturnEmptyOptionalWhenIdentificationDoesNotExist() {
        // Given
        String identification = "9999999999";
        when(clientJpaRepository.findByPersonIdentification(identification)).thenReturn(Optional.empty());

        // When
        Optional<Client> foundClient = clientRepositoryAdapter.findByPersonIdentification(identification);

        // Then
        assertFalse(foundClient.isPresent());

        verify(clientJpaRepository).findByPersonIdentification(identification);
        verify(clientMapper, never()).toDomain(any());
    }

    @Test
    @DisplayName("Should find all clients successfully")
    void shouldFindAllClientsSuccessfully() {
        // Given
        List<ClientEntity> clientEntities = Arrays.asList(validClientEntity);
        when(clientJpaRepository.findAll()).thenReturn(clientEntities);
        when(clientMapper.toDomain(validClientEntity)).thenReturn(validClient);

        // When
        List<Client> clients = clientRepositoryAdapter.findAll();

        // Then
        assertNotNull(clients);
        assertEquals(1, clients.size());
        assertEquals(validClient.getClientId(), clients.get(0).getClientId());

        verify(clientJpaRepository).findAll();
        verify(clientMapper).toDomain(validClientEntity);
    }

    @Test
    @DisplayName("Should find all active clients successfully")
    void shouldFindAllActiveClientsSuccessfully() {
        // Given
        List<ClientEntity> activeClientEntities = Arrays.asList(validClientEntity);
        when(clientJpaRepository.findAllActive()).thenReturn(activeClientEntities);
        when(clientMapper.toDomain(validClientEntity)).thenReturn(validClient);

        // When
        List<Client> activeClients = clientRepositoryAdapter.findAllActive();

        // Then
        assertNotNull(activeClients);
        assertEquals(1, activeClients.size());
        assertTrue(activeClients.get(0).isActive());
        assertEquals(validClient.getClientId(), activeClients.get(0).getClientId());

        verify(clientJpaRepository).findAllActive();
        verify(clientMapper).toDomain(validClientEntity);
    }

    @Test
    @DisplayName("Should delete client by ID successfully")
    void shouldDeleteClientByIdSuccessfully() {
        // Given
        Long clientId = 1L;

        // When
        clientRepositoryAdapter.deleteById(clientId);

        // Then
        verify(clientJpaRepository).deleteById(clientId);
    }

    @Test
    @DisplayName("Should return true when client exists by ID")
    void shouldReturnTrueWhenClientExistsById() {
        // Given
        Long clientId = 1L;
        when(clientJpaRepository.existsById(clientId)).thenReturn(true);

        // When
        boolean exists = clientRepositoryAdapter.existsById(clientId);

        // Then
        assertTrue(exists);
        verify(clientJpaRepository).existsById(clientId);
    }

    @Test
    @DisplayName("Should return false when client does not exist by ID")
    void shouldReturnFalseWhenClientDoesNotExistById() {
        // Given
        Long clientId = 999L;
        when(clientJpaRepository.existsById(clientId)).thenReturn(false);

        // When
        boolean exists = clientRepositoryAdapter.existsById(clientId);

        // Then
        assertFalse(exists);
        verify(clientJpaRepository).existsById(clientId);
    }

    @Test
    @DisplayName("Should return true when client exists by person identification")
    void shouldReturnTrueWhenClientExistsByPersonIdentification() {
        // Given
        String identification = "1234567890";
        when(clientJpaRepository.existsByPersonIdentification(identification)).thenReturn(true);

        // When
        boolean exists = clientRepositoryAdapter.existsByPersonIdentification(identification);

        // Then
        assertTrue(exists);
        verify(clientJpaRepository).existsByPersonIdentification(identification);
    }

    @Test
    @DisplayName("Should return false when client does not exist by person identification")
    void shouldReturnFalseWhenClientDoesNotExistByPersonIdentification() {
        // Given
        String identification = "9999999999";
        when(clientJpaRepository.existsByPersonIdentification(identification)).thenReturn(false);

        // When
        boolean exists = clientRepositoryAdapter.existsByPersonIdentification(identification);

        // Then
        assertFalse(exists);
        verify(clientJpaRepository).existsByPersonIdentification(identification);
    }
}