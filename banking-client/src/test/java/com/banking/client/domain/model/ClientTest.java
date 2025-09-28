package com.banking.client.domain.model;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for Client domain model
 */
class ClientTest {

    private Person validPerson;
    private Client.ClientBuilder validClientBuilder;

    @BeforeEach
    void setUp() {
        validPerson = Person.builder()
                .personId(1L)
                .fullName("Juan Pérez")
                .gender(Gender.HOMBRE)
                .age(30)
                .identification("1234567890")
                .address("Av. Principal 123")
                .phone("+593-99-123-4567")
                .build();

        validClientBuilder = Client.builder()
                .clientId(1L)
                .person(validPerson)
                .password("password123")
                .status(true);
    }

    @Test
    @DisplayName("Should create valid client with all required fields")
    void shouldCreateValidClient() {
        // Given
        Client client = validClientBuilder.build();

        // When & Then
        assertNotNull(client);
        assertEquals(1L, client.getClientId());
        assertEquals(validPerson, client.getPerson());
        assertEquals("password123", client.getPassword());
        assertTrue(client.getStatus());
    }

    @Test
    @DisplayName("Should return true for valid client")
    void shouldReturnTrueForValidClient() {
        // Given
        Client client = validClientBuilder.build();

        // When
        boolean isValid = client.isValid();

        // Then
        assertTrue(isValid);
    }

    @Test
    @DisplayName("Should return false when person is null")
    void shouldReturnFalseWhenPersonIsNull() {
        // Given
        Client client = validClientBuilder.person(null).build();

        // When
        boolean isValid = client.isValid();

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should return false when person is invalid")
    void shouldReturnFalseWhenPersonIsInvalid() {
        // Given
        Person invalidPerson = Person.builder()
                .fullName("")  // Invalid empty name
                .gender(Gender.HOMBRE)
                .age(30)
                .identification("1234567890")
                .build();
        Client client = validClientBuilder.person(invalidPerson).build();

        // When
        boolean isValid = client.isValid();

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should return false when password is null")
    void shouldReturnFalseWhenPasswordIsNull() {
        // Given
        Client client = validClientBuilder.password(null).build();

        // When
        boolean isValid = client.isValid();

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should return false when password is empty")
    void shouldReturnFalseWhenPasswordIsEmpty() {
        // Given
        Client client = validClientBuilder.password("").build();

        // When
        boolean isValid = client.isValid();

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should return false when password is blank")
    void shouldReturnFalseWhenPasswordIsBlank() {
        // Given
        Client client = validClientBuilder.password("   ").build();

        // When
        boolean isValid = client.isValid();

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should return false when password is too short")
    void shouldReturnFalseWhenPasswordIsTooShort() {
        // Given
        Client client = validClientBuilder.password("123").build();

        // When
        boolean isValid = client.isValid();

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should return true when password has minimum length")
    void shouldReturnTrueWhenPasswordHasMinimumLength() {
        // Given
        Client client = validClientBuilder.password("1234").build();

        // When
        boolean isValid = client.isValid();

        // Then
        assertTrue(isValid);
    }

    @Test
    @DisplayName("Should return true when client is active")
    void shouldReturnTrueWhenClientIsActive() {
        // Given
        Client client = validClientBuilder.status(true).build();

        // When
        boolean isActive = client.isActive();

        // Then
        assertTrue(isActive);
    }

    @Test
    @DisplayName("Should return false when client is inactive")
    void shouldReturnFalseWhenClientIsInactive() {
        // Given
        Client client = validClientBuilder.status(false).build();

        // When
        boolean isActive = client.isActive();

        // Then
        assertFalse(isActive);
    }

    @Test
    @DisplayName("Should return false when status is null")
    void shouldReturnFalseWhenStatusIsNull() {
        // Given
        Client client = validClientBuilder.status(null).build();

        // When
        boolean isActive = client.isActive();

        // Then
        assertFalse(isActive);
    }

    @Test
    @DisplayName("Should activate client successfully")
    void shouldActivateClientSuccessfully() {
        // Given
        Client client = validClientBuilder.status(false).build();

        // When
        client.activate();

        // Then
        assertTrue(client.getStatus());
        assertTrue(client.isActive());
    }

    @Test
    @DisplayName("Should deactivate client successfully")
    void shouldDeactivateClientSuccessfully() {
        // Given
        Client client = validClientBuilder.status(true).build();

        // When
        client.deactivate();

        // Then
        assertFalse(client.getStatus());
        assertFalse(client.isActive());
    }

    @Test
    @DisplayName("Should return person's full name")
    void shouldReturnPersonFullName() {
        // Given
        Client client = validClientBuilder.build();

        // When
        String fullName = client.getFullName();

        // Then
        assertEquals("Juan Pérez", fullName);
    }

    @Test
    @DisplayName("Should return empty string when person is null")
    void shouldReturnEmptyStringWhenPersonIsNull() {
        // Given
        Client client = validClientBuilder.person(null).build();

        // When
        String fullName = client.getFullName();

        // Then
        assertEquals("", fullName);
    }

    @Test
    @DisplayName("Should return person's identification")
    void shouldReturnPersonIdentification() {
        // Given
        Client client = validClientBuilder.build();

        // When
        String identification = client.getIdentification();

        // Then
        assertEquals("1234567890", identification);
    }

    @Test
    @DisplayName("Should return empty string when person is null for identification")
    void shouldReturnEmptyStringWhenPersonIsNullForIdentification() {
        // Given
        Client client = validClientBuilder.person(null).build();

        // When
        String identification = client.getIdentification();

        // Then
        assertEquals("", identification);
    }
}