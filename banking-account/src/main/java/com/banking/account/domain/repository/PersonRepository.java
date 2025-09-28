package com.banking.account.domain.repository;

import com.banking.account.domain.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
    Optional<Person> findByFullName(String fullName);
    boolean existsByFullName(String fullName);
}