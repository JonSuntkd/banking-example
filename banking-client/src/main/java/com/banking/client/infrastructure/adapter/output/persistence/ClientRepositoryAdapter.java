package com.banking.client.infrastructure.adapter.output.persistence;

import com.banking.client.domain.model.Client;
import com.banking.client.domain.port.output.ClientRepositoryPort;
import com.banking.client.infrastructure.adapter.output.persistence.mapper.ClientPersistenceMapper;
import com.banking.client.infrastructure.adapter.output.persistence.repository.ClientJpaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * JPA implementation of ClientRepositoryPort
 * This adapter implements the output port for client persistence
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ClientRepositoryAdapter implements ClientRepositoryPort {
    
    private final ClientJpaRepository clientJpaRepository;
    private final ClientPersistenceMapper clientMapper;
    
    @Override
    public Client save(Client client) {
        log.debug("Saving client with identification: {}", client.getIdentification());
        var clientEntity = clientMapper.toEntity(client);
        var savedEntity = clientJpaRepository.save(clientEntity);
        return clientMapper.toDomain(savedEntity);
    }
    
    @Override
    public Optional<Client> findById(Long clientId) {
        log.debug("Finding client by ID: {}", clientId);
        return clientJpaRepository.findById(clientId)
                .map(clientMapper::toDomain);
    }
    
    @Override
    public Optional<Client> findByPersonIdentification(String identification) {
        log.debug("Finding client by identification: {}", identification);
        return clientJpaRepository.findByPersonIdentification(identification)
                .map(clientMapper::toDomain);
    }
    
    @Override
    public List<Client> findAll() {
        log.debug("Finding all clients");
        return clientJpaRepository.findAll()
                .stream()
                .map(clientMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Client> findAllActive() {
        log.debug("Finding all active clients");
        return clientJpaRepository.findAllActive()
                .stream()
                .map(clientMapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteById(Long clientId) {
        log.debug("Deleting client with ID: {}", clientId);
        clientJpaRepository.deleteById(clientId);
    }
    
    @Override
    public boolean existsById(Long clientId) {
        log.debug("Checking if client exists with ID: {}", clientId);
        return clientJpaRepository.existsById(clientId);
    }
    
    @Override
    public boolean existsByPersonIdentification(String identification) {
        log.debug("Checking if client exists with identification: {}", identification);
        return clientJpaRepository.existsByPersonIdentification(identification);
    }
}