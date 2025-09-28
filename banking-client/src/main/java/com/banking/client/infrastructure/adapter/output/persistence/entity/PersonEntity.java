package com.banking.client.infrastructure.adapter.output.persistence.entity;

import com.banking.client.domain.model.Gender;
import com.banking.client.infrastructure.adapter.output.persistence.converter.GenderConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * JPA Entity for Person table
 * Maps to the person table in the database
 */
@Entity
@Table(name = "person")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "person_id")
    private Long personId;
    
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;
    
    @Convert(converter = GenderConverter.class)
    @Column(name = "gender", length = 10)  // Opcional - removido nullable = false
    private Gender gender;
    
    @Column(name = "age")  // Opcional - removido nullable = false
    private Integer age;
    
    @Column(name = "identification", unique = true, length = 50)  // Opcional - removido nullable = false
    private String identification;
    
    @Column(name = "address", nullable = false, length = 255)  // OBLIGATORIO
    private String address;
    
    @Column(name = "phone", nullable = false, length = 20)  // OBLIGATORIO
    private String phone;
}