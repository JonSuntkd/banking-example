# Banking Account Microservice - Copilot Instructions

## Proyecto
Microservicio banking-account implementado con arquitectura hexagonal, Spring Boot 3.2.5, Java 17 y PostgreSQL.

## Estructura del Proyecto
```
src/main/java/com/banking/account/
├── BankingAccountApplication.java          # Clase principal
├── application/service/                    # Servicios de aplicación
│   └── AccountService.java                 # Lógica de negocio CRUD
├── domain/                                # Dominio
│   ├── model/                             # Entidades
│   │   ├── Person.java
│   │   ├── Client.java
│   │   └── Account.java
│   ├── repository/                        # Contratos de repositorio
│   │   ├── PersonRepository.java
│   │   ├── ClientRepository.java
│   │   └── AccountRepository.java
│   └── exception/                         # Excepciones de dominio
│       ├── ClientNotFoundException.java
│       ├── DuplicateAccountException.java
│       └── AccountNotFoundException.java
└── infrastructure/                        # Infraestructura
    ├── controller/                        # Controladores REST
    │   └── AccountController.java
    ├── dto/                              # DTOs
    │   ├── CreateAccountWithClientRequest.java
    │   └── ErrorResponse.java
    └── exception/                        # Manejo global de excepciones
        └── GlobalExceptionHandler.java
```

## Características Implementadas
- ✅ Arquitectura hexagonal (Domain, Application, Infrastructure)
- ✅ Principios SOLID y Clean Code
- ✅ CRUD completo de cuentas
- ✅ Validación de cliente existente por nombre
- ✅ Prevención de cuentas duplicadas
- ✅ Manejo de excepciones personalizado
- ✅ DTOs con validaciones
- ✅ Endpoints REST completos
- ✅ Colección Postman para pruebas

## Endpoints
- `GET /account` - Listar todas las cuentas
- `GET /account/{id}` - Obtener cuenta por ID
- `POST /account` - Crear cuenta (clientName como parámetro)
- `POST /account/with-client` - Crear cuenta (clientName en body)
- `PUT /account/{id}` - Actualizar cuenta
- `DELETE /account/{id}` - Eliminar cuenta
- `GET /actuator/health` - Health check

## Flujo de Creación de Cuenta
1. Recibe clientName
2. Busca Person por full_name
3. Busca Client por person_id
4. Valida cuenta no duplicada
5. Crea Account con client_id

## Base de Datos
- **Host:** gondola.proxy.rlwy.net:40809
- **Base de datos:** railway
- **Usuario:** postgres
- **Esquema:** person → client → account → account_transaction

## Ejecución
```bash
./gradlew bootRun
```
Servidor disponible en: http://localhost:8002

## Pruebas
Importar `banking-account.postman_collection.json` en Postman para probar todos los endpoints y casos de error.