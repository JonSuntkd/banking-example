package com.banking.client.domain.port.input;

import com.banking.client.domain.model.Client;
import java.util.List;

/**
 * Input port for Client use cases
 * Follows Hexagonal Architecture - defines the contract for client operations
 */
public interface ClientUseCase {
    
    /**
     * Creates a new client
     * @param client the client to create
     * @return the created client
     */
    Client createClient(Client client);
    
    /**
     * Gets a client by ID
     * @param clientId the client ID
     * @return the client
     */
    Client getClientById(Long clientId);
    
    /**
     * Gets a client by identification
     * @param identification the person identification
     * @return the client
     */
    Client getClientByIdentification(String identification);
    
    /**
     * Gets all clients
     * @return list of all clients
     */
    List<Client> getAllClients();
    
    /**
     * Gets all active clients
     * @return list of active clients
     */
    List<Client> getActiveClients();
    
    /**
     * Updates an existing client
     * @param clientId the client ID
     * @param client the updated client data
     * @return the updated client
     */
    Client updateClient(Long clientId, Client client);
    
    /**
     * Deletes a client by ID
     * @param clientId the client ID
     */
    void deleteClient(Long clientId);
    
    /**
     * Activates a client
     * @param clientId the client ID
     * @return the activated client
     */
    Client activateClient(Long clientId);
    
    /**
     * Deactivates a client
     * @param clientId the client ID
     * @return the deactivated client
     */
    Client deactivateClient(Long clientId);
}