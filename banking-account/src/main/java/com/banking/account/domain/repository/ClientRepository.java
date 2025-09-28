package com.banking.account.domain.repository;

import com.banking.account.domain.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByPerson_PersonId(Long personId);
    Optional<Client> findByPerson_FullName(String fullName);
}