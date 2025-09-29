package com.banking.client.domain.model;

/**
 * Gender enumeration with Spanish values
 * Matches database CHECK constraint values
 */
public enum Gender {
    HOMBRE("HOMBRE"),
    MUJER("MUJER"),
    OTRO("OTRO");

    private final String value;

    Gender(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static Gender fromValue(String value) {
        for (Gender gender : Gender.values()) {
            if (gender.value.equals(value)) {
                return gender;
            }
        }
        throw new IllegalArgumentException("Invalid gender value: " + value);
    }

    @Override
    public String toString() {
        return value;
    }
}