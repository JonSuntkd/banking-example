# Banking Account Microservice

Microservicio para gestión de cuentas bancarias implementado con arquitectura hexagonal.

## Características

- **Lenguaje:** Java 17
- **Framework:** Spring Boot 3.2.5
- **Arquitectura:** Hexagonal
- **Paradigma:** MVC
- **Principios:** Clean Code, SOLID
- **Gestor de dependencias:** Gradle
- **Base de datos:** PostgreSQL
- **Puerto:** 8002

## Funcionalidades

- CRUD completo de cuentas bancarias
- Validación de existencia de cliente por nombre
- Prevención de cuentas duplicadas
- Manejo de excepciones personalizadas
- Endpoints REST con validaciones

## Endpoints

- `GET /account` - Obtener todas las cuentas
- `GET /account/{id}` - Obtener cuenta por ID
- `POST /account` - Crear cuenta (con parámetro clientName)
- `POST /account/with-client` - Crear cuenta con cliente en body
- `PUT /account/{id}` - Actualizar cuenta
- `DELETE /account/{id}` - Eliminar cuenta

## Base de Datos

### Conexión
- Host: gondola.proxy.rlwy.net
- Puerto: 40809
- Base de datos: railway
- Usuario: postgres

### Esquema
- `person` - Información personal
- `client` - Clientes del banco
- `account` - Cuentas bancarias
- `account_transaction` - Transacciones

## Ejecución

```bash
./gradlew bootRun
```

El microservicio estará disponible en `http://localhost:8002`

## Pruebas

Importar la colección Postman `banking-account.postman_collection.json` para probar todos los endpoints.