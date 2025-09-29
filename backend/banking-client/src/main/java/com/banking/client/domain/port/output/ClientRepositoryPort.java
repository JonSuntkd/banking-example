package com.banking.client.domain.port.output;

import com.banking.client.domain.model.Client;
import java.util.List;
import java.util.Optional;

/**
 * Output port for Client persistence operations
 * Follows Hexagonal Architecture - this is the port that will be implemented by adapters
 */
public interface ClientRepositoryPort {
    
    /**
     * Saves a client
     * @param client the client to save
     * @return the saved client
     */
    Client save(Client client);
    
    /**
     * Finds a client by ID
     * @param clientId the client ID
     * @return optional client
     */
    Optional<Client> findById(Long clientId);
    
    /**
     * Finds a client by identification
     * @param identification the person identification
     * @return optional client
     */
    Optional<Client> findByPersonIdentification(String identification);
    
    /**
     * Finds all clients
     * @return list of all clients
     */
    List<Client> findAll();
    
    /**
     * Finds all active clients
     * @return list of active clients
     */
    List<Client> findAllActive();
    
    /**
     * Deletes a client by ID
     * @param clientId the client ID
     */
    void deleteById(Long clientId);
    
    /**
     * Checks if a client exists by ID
     * @param clientId the client ID
     * @return true if client exists
     */
    boolean existsById(Long clientId);
    
    /**
     * Checks if a person identification is already registered
     * @param identification the person identification
     * @return true if identification exists
     */
    boolean existsByPersonIdentification(String identification);
}