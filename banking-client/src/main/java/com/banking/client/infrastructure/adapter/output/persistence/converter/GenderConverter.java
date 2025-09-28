package com.banking.client.infrastructure.adapter.output.persistence.converter;

import com.banking.client.domain.model.Gender;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * JPA AttributeConverter for Gender enum
 * Converts between Gender enum and Spanish database values
 */
@Converter(autoApply = true)
public class GenderConverter implements AttributeConverter<Gender, String> {

    @Override
    public String convertToDatabaseColumn(Gender gender) {
        if (gender == null) {
            return null;
        }
        return gender.getValue();
    }

    @Override
    public Gender convertToEntityAttribute(String dbValue) {
        if (dbValue == null || dbValue.trim().isEmpty()) {
            return null;
        }
        return Gender.fromValue(dbValue);
    }
}