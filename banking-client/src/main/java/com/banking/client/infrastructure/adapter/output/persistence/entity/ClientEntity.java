package com.banking.client.infrastructure.adapter.output.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * JPA Entity for Client table
 * Maps to the client table in the database
 */
@Entity
@Table(name = "client")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_id")
    private Long clientId;
    
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id", nullable = false, unique = true)
    private PersonEntity person;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "status", nullable = false)  // OBLIGATORIO según nuevo esquema
    @Builder.Default
    private Boolean status = true;
}