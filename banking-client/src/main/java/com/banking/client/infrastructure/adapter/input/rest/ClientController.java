package com.banking.client.infrastructure.adapter.input.rest;

import com.banking.client.domain.port.input.ClientUseCase;
import com.banking.client.infrastructure.adapter.input.rest.dto.BasicClientRequest;
import com.banking.client.infrastructure.adapter.input.rest.dto.ClientRequest;
import com.banking.client.infrastructure.adapter.input.rest.dto.ClientResponse;
import com.banking.client.infrastructure.adapter.input.rest.dto.ClientListResponse;
import com.banking.client.infrastructure.adapter.input.rest.mapper.ClientRestMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Client operations
 * Implements RESTful API following REST principles and HTTP standards
 */
@RestController
@RequestMapping("/client")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Client Management", description = "APIs for managing banking clients")
public class ClientController {
    
    private final ClientUseCase clientUseCase;
    private final ClientRestMapper clientRestMapper;
    
    @Operation(summary = "Create a new client", description = "Creates a new banking client with person information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Client created successfully",
            content = @Content(schema = @Schema(implementation = ClientResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid client data"),
        @ApiResponse(responseCode = "409", description = "Client already exists")
    })
    @PostMapping
    public ResponseEntity<ClientResponse> createClient(
            @Valid @RequestBody ClientRequest clientRequest) {
        log.info("Received request to create client with identification: {}", 
                 clientRequest.getPerson().getIdentification());
        
        var client = clientRestMapper.toDomain(clientRequest);
        var createdClient = clientUseCase.createClient(client);
        var response = clientRestMapper.toResponse(createdClient);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @Operation(summary = "Create a new client with basic information", 
               description = "Creates a new banking client with only essential information (name, address, phone, password, status)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Client created successfully",
            content = @Content(schema = @Schema(implementation = ClientResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid client data"),
        @ApiResponse(responseCode = "409", description = "Client already exists")
    })
    @PostMapping("/basic")
    public ResponseEntity<ClientResponse> createBasicClient(
            @Valid @RequestBody BasicClientRequest basicClientRequest) {
        log.info("Received request to create basic client with name: {}", 
                 basicClientRequest.getFullName());
        
        var client = clientRestMapper.toDomainFromBasic(basicClientRequest);
        var createdClient = clientUseCase.createClient(client);
        var response = clientRestMapper.toResponse(createdClient);
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @Operation(summary = "Get client by ID", description = "Retrieves a client by their unique identifier")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Client found",
            content = @Content(schema = @Schema(implementation = ClientResponse.class))),
        @ApiResponse(responseCode = "404", description = "Client not found")
    })
    @GetMapping("/{clientId}")
    public ResponseEntity<ClientResponse> getClientById(
            @Parameter(description = "Client unique identifier") 
            @PathVariable Long clientId) {
        log.info("Received request to get client by ID: {}", clientId);
        
        var client = clientUseCase.getClientById(clientId);
        var response = clientRestMapper.toResponse(client);
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Get client by identification", description = "Retrieves a client by their person identification")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Client found",
            content = @Content(schema = @Schema(implementation = ClientResponse.class))),
        @ApiResponse(responseCode = "404", description = "Client not found")
    })
    @GetMapping("/identification/{identification}")
    public ResponseEntity<ClientResponse> getClientByIdentification(
            @Parameter(description = "Person identification number") 
            @PathVariable String identification) {
        log.info("Received request to get client by identification: {}", identification);
        
        var client = clientUseCase.getClientByIdentification(identification);
        var response = clientRestMapper.toResponse(client);
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Get all clients", description = "Retrieves all clients")
    @ApiResponse(responseCode = "200", description = "Clients retrieved successfully")
    @GetMapping
    public ResponseEntity<List<ClientListResponse>> getAllClients(
            @Parameter(description = "Filter by status (active/inactive)")
            @RequestParam(required = false, defaultValue = "all") String status) {
        log.info("Received request to get all clients with status filter: {}", status);
        
        List<ClientListResponse> responses;
        
        if ("active".equalsIgnoreCase(status)) {
            var clients = clientUseCase.getActiveClients();
            responses = clientRestMapper.toListResponseList(clients);
        } else {
            var clients = clientUseCase.getAllClients();
            responses = clientRestMapper.toListResponseList(clients);
        }
        
        return ResponseEntity.ok(responses);
    }
    
    @Operation(summary = "Update client", description = "Updates an existing client")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Client updated successfully",
            content = @Content(schema = @Schema(implementation = ClientResponse.class))),
        @ApiResponse(responseCode = "400", description = "Invalid client data"),
        @ApiResponse(responseCode = "404", description = "Client not found"),
        @ApiResponse(responseCode = "409", description = "Identification already exists")
    })
    @PutMapping("/{clientId}")
    public ResponseEntity<ClientResponse> updateClient(
            @Parameter(description = "Client unique identifier") 
            @PathVariable Long clientId,
            @Valid @RequestBody ClientRequest clientRequest) {
        log.info("Received request to update client ID: {}", clientId);
        
        var client = clientRestMapper.toDomain(clientRequest);
        var updatedClient = clientUseCase.updateClient(clientId, client);
        var response = clientRestMapper.toResponse(updatedClient);
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Delete client", description = "Deletes a client by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Client deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Client not found")
    })
    @DeleteMapping("/{clientId}")
    public ResponseEntity<Void> deleteClient(
            @Parameter(description = "Client unique identifier") 
            @PathVariable Long clientId) {
        log.info("Received request to delete client ID: {}", clientId);
        
        clientUseCase.deleteClient(clientId);
        
        return ResponseEntity.noContent().build();
    }
    
    @Operation(summary = "Activate client", description = "Activates a client by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Client activated successfully",
            content = @Content(schema = @Schema(implementation = ClientResponse.class))),
        @ApiResponse(responseCode = "404", description = "Client not found")
    })
    @PatchMapping("/{clientId}/activate")
    public ResponseEntity<ClientResponse> activateClient(
            @Parameter(description = "Client unique identifier") 
            @PathVariable Long clientId) {
        log.info("Received request to activate client ID: {}", clientId);
        
        var client = clientUseCase.activateClient(clientId);
        var response = clientRestMapper.toResponse(client);
        
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "Deactivate client", description = "Deactivates a client by ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Client deactivated successfully",
            content = @Content(schema = @Schema(implementation = ClientResponse.class))),
        @ApiResponse(responseCode = "404", description = "Client not found")
    })
    @PatchMapping("/{clientId}/deactivate")
    public ResponseEntity<ClientResponse> deactivateClient(
            @Parameter(description = "Client unique identifier") 
            @PathVariable Long clientId) {
        log.info("Received request to deactivate client ID: {}", clientId);
        
        var client = clientUseCase.deactivateClient(clientId);
        var response = clientRestMapper.toResponse(client);
        
        return ResponseEntity.ok(response);
    }
}