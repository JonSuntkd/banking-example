package com.banking.transaction.infrastructure;

import jakarta.persistence.*;

@Entity
@Table(name = "client")
public class ClientEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clientId;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false)
    private Boolean status;

    // Join with Person
    @OneToOne
    @JoinColumn(name = "person_id", nullable = false)
    private PersonEntity person;

    // Getters and setters
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }
    public PersonEntity getPerson() { return person; }
    public void setPerson(PersonEntity person) { this.person = person; }
}