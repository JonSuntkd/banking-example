# Banking Client API

A RESTful API for managing banking clients built with Spring Boot following hexagonal architecture principles.

## Architecture

This project implements **Hexagonal Architecture (Ports and Adapters)** with the following structure:

```
src/main/java/com/banking/client/
├── domain/
│   ├── model/           # Domain entities (Person, Client, Gender)
│   ├── port/
│   │   ├── input/       # Input ports (Use cases interfaces)
│   │   └── output/      # Output ports (Repository interfaces)
│   └── exception/       # Domain exceptions
├── application/
│   └── service/         # Business logic implementation
└── infrastructure/
    └── adapter/
        ├── input/
        │   └── rest/    # REST controllers, DTOs, mappers
        └── output/
            └── persistence/ # JPA entities, repositories, mappers
```

## Technologies

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **PostgreSQL**
- **Gradle**
- **MapStruct** (for mapping)
- **Lombok** (to reduce boilerplate)
- **SpringDoc OpenAPI** (API documentation)

## Features

- **CRUD operations** for banking clients
- **Clean Architecture** with clear separation of concerns
- **SOLID principles** implementation
- **Input validation** using Bean Validation
- **Global exception handling**
- **API documentation** with Swagger/OpenAPI
- **Database integration** with PostgreSQL on Railway
- **Comprehensive logging**

## Database Schema

The application uses the following database tables:

- `person`: Store personal information
- `client`: Store client-specific data with reference to person

### Gender Values
The application supports the following gender values (in Spanish):
- **HOMBRE**: Male
- **MUJER**: Female  
- **OTRO**: Other

These values are stored in Spanish in the database and mapped through a custom JPA converter.

## API Endpoints

### Client Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/client` | Create a new client |
| GET | `/api/v1/client/{id}` | Get client by ID |
| GET | `/api/v1/client/identification/{identification}` | Get client by identification |
| GET | `/api/v1/client` | Get all clients |
| GET | `/api/v1/client?status=active` | Get active clients only |
| PUT | `/api/v1/client/{id}` | Update client |
| DELETE | `/api/v1/client/{id}` | Delete client |
| PATCH | `/api/v1/client/{id}/activate` | Activate client |
| PATCH | `/api/v1/client/{id}/deactivate` | Deactivate client |

## Configuration

### Database Configuration

The application connects to PostgreSQL on Railway with these credentials:
- **Host**: gondola.proxy.rlwy.net
- **Port**: 40809
- **Database**: railway
- **Username**: postgres
- **Password**: gVGvsyyMauTSYTpFwemcKILhuLuvUacf

### Running the Application

1. **Prerequisites**:
   - Java 17 or higher
   - Gradle 8.4 or higher

2. **Build the project**:
   ```bash
   ./gradlew build
   ```

3. **Run the application**:
   ```bash
   ./gradlew bootRun
   ```

4. **Run with development profile**:
   ```bash
   ./gradlew bootRun --args='--spring.profiles.active=dev'
   ```

### API Documentation

Once the application is running, you can access:

- **Swagger UI**: http://localhost:8080/api/v1/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/v1/api-docs

### Health Check

- **Health endpoint**: http://localhost:8080/api/v1/actuator/health

## Sample Requests

### Create Client
```json
POST /api/v1/client
{
  "person": {
    "fullName": "Juan Pérez",
    "gender": "HOMBRE",
    "age": 30,
    "identification": "1234567890",
    "address": "Av. Principal 123",
    "phone": "+593-99-123-4567"
  },
  "password": "securePassword123",
  "status": true
}
```

### Update Client
```json
PUT /api/v1/client/1
{
  "person": {
    "fullName": "Juan Pérez Actualizado",
    "gender": "HOMBRE",
    "age": 31,
    "identification": "1234567890",
    "address": "Av. Secundaria 456",
    "phone": "+593-99-123-4568"
  },
  "password": "newSecurePassword123",
  "status": true
}
```

## Error Handling

The API returns standardized error responses:

```json
{
  "timestamp": "2025-01-01T10:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Client not found with ID: 123",
  "path": "/api/v1/client/123"
}
```

## Development

### Profiles

- **default**: Production-ready configuration
- **dev**: Development configuration with enhanced logging and auto-schema creation

### Logging

The application uses structured logging with different levels for development and production:

- **Production**: INFO level
- **Development**: DEBUG level with SQL query logging

## Architecture Principles

This application follows:

1. **Hexagonal Architecture**: Clear separation between domain, application, and infrastructure layers
2. **SOLID Principles**: Single responsibility, open/closed, Liskov substitution, interface segregation, and dependency inversion
3. **Clean Code**: Meaningful names, small functions, and clear structure
4. **Domain-Driven Design**: Business logic encapsulated in domain models
5. **Dependency Injection**: Using Spring's IoC container for loose coupling

## Testing

Run tests with:
```bash
./gradlew test
```

## Contributing

1. Follow the existing code structure and naming conventions
2. Ensure all tests pass
3. Add unit tests for new features
4. Follow Clean Code principles
5. Document any new API endpoints