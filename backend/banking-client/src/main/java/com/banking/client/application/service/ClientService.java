package com.banking.client.application.service;

import com.banking.client.domain.exception.ClientAlreadyExistsException;
import com.banking.client.domain.exception.ClientNotFoundException;
import com.banking.client.domain.exception.InvalidClientDataException;
import com.banking.client.domain.model.Client;
import com.banking.client.domain.port.input.ClientUseCase;
import com.banking.client.domain.port.output.ClientRepositoryPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service implementation for Client use cases
 * Implements business logic following Clean Architecture and SOLID principles
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ClientService implements ClientUseCase {
    
    private final ClientRepositoryPort clientRepositoryPort;
    
    @Override
    public Client createClient(Client client) {
        log.info("Creating client with identification: {}", client.getIdentification());
        
        // Validate client data
        if (!client.isValid()) {
            throw new InvalidClientDataException("Client data is invalid");
        }
        
        // Check if client already exists (only if identification is provided)
        String identification = client.getIdentification();
        if (identification != null && !identification.isEmpty() &&
            clientRepositoryPort.existsByPersonIdentification(identification)) {
            throw ClientAlreadyExistsException.byIdentification(identification);
        }
        
        // Set default status if not provided
        if (client.getStatus() == null) {
            client.setStatus(true);
        }
        
        Client savedClient = clientRepositoryPort.save(client);
        log.info("Client created successfully with ID: {}", savedClient.getClientId());
        return savedClient;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Client getClientById(Long clientId) {
        log.debug("Getting client by ID: {}", clientId);
        return clientRepositoryPort.findById(clientId)
                .orElseThrow(() -> ClientNotFoundException.byId(clientId));
    }
    
    @Override
    @Transactional(readOnly = true)
    public Client getClientByIdentification(String identification) {
        log.debug("Getting client by identification: {}", identification);
        
        if (identification == null || identification.isEmpty()) {
            throw new IllegalArgumentException("Identification cannot be null or empty");
        }
        
        return clientRepositoryPort.findByPersonIdentification(identification)
                .orElseThrow(() -> ClientNotFoundException.byIdentification(identification));
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Client> getAllClients() {
        log.debug("Getting all clients");
        return clientRepositoryPort.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Client> getActiveClients() {
        log.debug("Getting all active clients");
        return clientRepositoryPort.findAllActive();
    }
    
    @Override
    public Client updateClient(Long clientId, Client client) {
        log.info("Updating client with ID: {}", clientId);
        
        // Check if client exists
        Client existingClient = getClientById(clientId);
        
        // Validate updated client data
        if (!client.isValid()) {
            throw new InvalidClientDataException("Updated client data is invalid");
        }
        
        // Check if identification is being changed and if it's already taken
        String existingIdentification = existingClient.getIdentification();
        String newIdentification = client.getIdentification();
        
        // Only check for duplicate identification if:
        // 1. The new identification is not null or empty
        // 2. The identification is actually being changed
        if (newIdentification != null && !newIdentification.isEmpty() &&
            !newIdentification.equals(existingIdentification) &&
            clientRepositoryPort.existsByPersonIdentification(newIdentification)) {
            throw ClientAlreadyExistsException.byIdentification(newIdentification);
        }
        
        // Update client maintaining the existing ID
        client.setClientId(clientId);
        Client updatedClient = clientRepositoryPort.save(client);
        log.info("Client updated successfully with ID: {}", updatedClient.getClientId());
        return updatedClient;
    }
    
    @Override
    public void deleteClient(Long clientId) {
        log.info("Deleting client with ID: {}", clientId);
        
        // Check if client exists
        if (!clientRepositoryPort.existsById(clientId)) {
            throw ClientNotFoundException.byId(clientId);
        }
        
        clientRepositoryPort.deleteById(clientId);
        log.info("Client deleted successfully with ID: {}", clientId);
    }
    
    @Override
    public Client activateClient(Long clientId) {
        log.info("Activating client with ID: {}", clientId);
        
        Client client = getClientById(clientId);
        client.activate();
        Client updatedClient = clientRepositoryPort.save(client);
        log.info("Client activated successfully with ID: {}", clientId);
        return updatedClient;
    }
    
    @Override
    public Client deactivateClient(Long clientId) {
        log.info("Deactivating client with ID: {}", clientId);
        
        Client client = getClientById(clientId);
        client.deactivate();
        Client updatedClient = clientRepositoryPort.save(client);
        log.info("Client deactivated successfully with ID: {}", clientId);
        return updatedClient;
    }
}