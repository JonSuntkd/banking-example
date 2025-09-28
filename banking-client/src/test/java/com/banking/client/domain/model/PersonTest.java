package com.banking.client.domain.model;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for Person domain model
 */
class PersonTest {

    private Person.PersonBuilder validPersonBuilder;

    @BeforeEach
    void setUp() {
        validPersonBuilder = Person.builder()
                .personId(1L)
                .fullName("Juan Pérez García")
                .gender(Gender.HOMBRE)
                .age(30)
                .identification("1234567890")
                .address("Av. Principal 123")
                .phone("+593-99-123-4567");
    }

    @Test
    @DisplayName("Should create valid person with all required fields")
    void shouldCreateValidPerson() {
        // Given
        Person person = validPersonBuilder.build();

        // When & Then
        assertNotNull(person);
        assertEquals(1L, person.getPersonId());
        assertEquals("Juan Pérez García", person.getFullName());
        assertEquals(Gender.HOMBRE, person.getGender());
        assertEquals(30, person.getAge());
        assertEquals("1234567890", person.getIdentification());
        assertEquals("Av. Principal 123", person.getAddress());
        assertEquals("+593-99-123-4567", person.getPhone());
    }

    @Test
    @DisplayName("Should return true for valid person")
    void shouldReturnTrueForValidPerson() {
        // Given
        Person person = validPersonBuilder.build();

        // When
        boolean isValid = person.isValid();

        // Then
        assertTrue(isValid);
    }

    @Test
    @DisplayName("Should return false when full name is null")
    void shouldReturnFalseWhenFullNameIsNull() {
        // Given
        Person person = validPersonBuilder.fullName(null).build();

        // When
        boolean isValid = person.isValid();

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should return false when full name is empty")
    void shouldReturnFalseWhenFullNameIsEmpty() {
        // Given
        Person person = validPersonBuilder.fullName("").build();

        // When
        boolean isValid = person.isValid();

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should return false when full name is blank")
    void shouldReturnFalseWhenFullNameIsBlank() {
        // Given
        Person person = validPersonBuilder.fullName("   ").build();

        // When
        boolean isValid = person.isValid();

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should return true when gender is null (optional field)")
    void shouldReturnTrueWhenGenderIsNull() {
        // Given
        Person person = validPersonBuilder.gender(null).build();

        // When
        boolean isValid = person.isValid();

        // Then
        assertTrue(isValid);  // Gender is now optional
    }

    @Test
    @DisplayName("Should return true when age is null (optional field)")
    void shouldReturnTrueWhenAgeIsNull() {
        // Given
        Person person = validPersonBuilder.age(null).build();

        // When
        boolean isValid = person.isValid();

        // Then
        assertTrue(isValid);  // Age is now optional
    }

    @Test
    @DisplayName("Should return false when age is negative")
    void shouldReturnFalseWhenAgeIsNegative() {
        // Given
        Person person = validPersonBuilder.age(-1).build();

        // When
        boolean isValid = person.isValid();

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should return true when age is zero")
    void shouldReturnTrueWhenAgeIsZero() {
        // Given
        Person person = validPersonBuilder.age(0).build();

        // When
        boolean isValid = person.isValid();

        // Then
        assertTrue(isValid);
    }

    @Test
    @DisplayName("Should return true when identification is null (optional field)")
    void shouldReturnTrueWhenIdentificationIsNull() {
        // Given
        Person person = validPersonBuilder.identification(null).build();

        // When
        boolean isValid = person.isValid();

        // Then
        assertTrue(isValid);  // Identification is now optional
    }

    @Test
    @DisplayName("Should return false when identification is empty")
    void shouldReturnFalseWhenIdentificationIsEmpty() {
        // Given
        Person person = validPersonBuilder.identification("").build();

        // When
        boolean isValid = person.isValid();

        // Then
        assertFalse(isValid);
    }

    @Test
    @DisplayName("Should return display name correctly")
    void shouldReturnDisplayNameCorrectly() {
        // Given
        Person person = validPersonBuilder.fullName("María González").build();

        // When
        String displayName = person.getDisplayName();

        // Then
        assertEquals("María González", displayName);
    }

    @Test
    @DisplayName("Should return empty string when full name is null")
    void shouldReturnEmptyStringWhenFullNameIsNull() {
        // Given
        Person person = validPersonBuilder.fullName(null).build();

        // When
        String displayName = person.getDisplayName();

        // Then
        assertEquals("", displayName);
    }

    @Test
    @DisplayName("Should trim display name")
    void shouldTrimDisplayName() {
        // Given
        Person person = validPersonBuilder.fullName("  Carlos Mendoza  ").build();

        // When
        String displayName = person.getDisplayName();

        // Then
        assertEquals("Carlos Mendoza", displayName);
    }

    // === NEW TESTS FOR REQUIRED FIELDS ===

    @Test
    @DisplayName("Should return false when address is null")
    void shouldReturnFalseWhenAddressIsNull() {
        // Given
        Person person = validPersonBuilder.address(null).build();

        // When
        boolean isValid = person.isValid();

        // Then
        assertFalse(isValid);  // Address is now required
    }

    @Test
    @DisplayName("Should return false when address is empty")
    void shouldReturnFalseWhenAddressIsEmpty() {
        // Given
        Person person = validPersonBuilder.address("").build();

        // When
        boolean isValid = person.isValid();

        // Then
        assertFalse(isValid);  // Address is now required
    }

    @Test
    @DisplayName("Should return false when phone is null")
    void shouldReturnFalseWhenPhoneIsNull() {
        // Given
        Person person = validPersonBuilder.phone(null).build();

        // When
        boolean isValid = person.isValid();

        // Then
        assertFalse(isValid);  // Phone is now required
    }

    @Test
    @DisplayName("Should return false when phone is empty")
    void shouldReturnFalseWhenPhoneIsEmpty() {
        // Given
        Person person = validPersonBuilder.phone("").build();

        // When
        boolean isValid = person.isValid();

        // Then
        assertFalse(isValid);  // Phone is now required
    }
}