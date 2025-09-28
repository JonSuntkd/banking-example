# banking-transaction

Microservicio Java Spring Boot para manejo de transacciones bancarias.

## Características

- **Lenguaje**: Java 17
- **Framework**: Spring Boot 3.2.5
- **Arquitectura**: Hexagonal
- **Paradigma**: MVC
- **Principios**: Clean Code, SOLID
- **Gestor de dependencias**: Gradle 8.5
- **Base de datos**: PostgreSQL
- **Puerto**: 8003

## Estructura del Proyecto

```
src/
├── main/
│   └── java/
│       └── com.banking.transaction/
│           ├── BankingTransactionApplication.java
│           ├── adapters/          # Controladores REST
│           ├── application/       # Servicios y DTOs
│           ├── config/           # Configuraciones
│           ├── domain/           # Entidades de dominio
│           ├── exception/        # Manejo de excepciones
│           └── infrastructure/   # Repositorios y entidades JPA
```

## Endpoints

### Transacciones
- `POST /transaction` - Crear nueva transacción
- `GET /transaction` - Obtener todas las transacciones
- `GET /transaction/report?date=dd/MM/yyyy` - Reporte de movimientos por fecha
- `PUT /transaction/{id}` - Actualizar transacción
- `DELETE /transaction/{id}` - Eliminar transacción

## Configuración de Base de Datos

**PostgreSQL**:
- **Host**: gondola.proxy.rlwy.net
- **Puerto**: 40809
- **Base de datos**: railway
- **Usuario**: postgres
- **Contraseña**: gVGvsyyMauTSYTpFwemcKILhuLuvUacf

## Esquema de Base de Datos

El proyecto utiliza las siguientes tablas:
- `person` - Datos personales
- `client` - Clientes del banco
- `account` - Cuentas bancarias
- `account_transaction` - Movimientos/transacciones

### Obtener Todas las Transacciones

**Response**:
```json
[
  {
    "accountNumber": "225487",
    "transactionDate": "2025-09-28T16:50:55.921945",
    "transactionType": "Retiro",
    "amount": 575.00,
    "balance": 1425.00
  }
]
```

## Uso

### Crear Transacción

**Request**:
```json
{
  "accountNumber": "225487",
  "transactionType": "Deposito",
  "amount": 575.00
}
```

**Response**:
```json
{
  "accountNumber": "225487",
  "transactionType": "Deposito",
  "amount": 575.00,
  "balance": 1575.00
}
```

### Validaciones

- La cuenta debe existir en la base de datos
- **La cuenta debe estar activa (status = true)**
- Para depósitos: se suma el monto al saldo actual
- Para retiros: se valida que hay fondos suficientes
- Se actualiza el saldo de la cuenta después de cada transacción

## Ejecución

```bash
./gradlew bootRun
```

El servicio estará disponible en: `http://localhost:8003`

## Pruebas

Se incluye una colección Postman (`banking-transaction.postman_collection.json`) para probar todos los endpoints.

## Manejo de Excepciones

- Cuenta no existe
- **Cuenta desactivada**
- Fondos insuficientes para retiro
- Tipo de transacción inválido
- Transacción no encontrada

Todas las excepciones devuelven un formato estándar:
```json
{
  "status": "ERROR",
  "message": "Descripción del error"
}
```
