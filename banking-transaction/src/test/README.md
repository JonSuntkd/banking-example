# Pruebas Unitarias - Banking Transaction

Este directorio contiene todas las pruebas unitarias e integración del proyecto banking-transaction.

## Estructura de Pruebas

```
src/test/java/
└── com/banking/transaction/
    ├── adapters/                          # Pruebas de controladores
    │   └── TransactionControllerTest.java
    ├── application/                       # Pruebas de servicios
    │   ├── TransactionServiceImplTest.java
    │   └── dto/                          # Pruebas de DTOs
    │       ├── TransactionRequestTest.java
    │       └── TransactionResponseTest.java
    ├── domain/                           # Pruebas de dominio
    │   └── AccountTransactionTest.java
    ├── infrastructure/                   # Pruebas de repositorios
    │   ├── AccountRepositoryTest.java
    │   └── AccountTransactionRepositoryTest.java
    ├── exception/                        # Pruebas de manejo de excepciones
    │   └── GlobalExceptionHandlerTest.java
    └── BankingTransactionIntegrationTest.java  # Pruebas de integración
```

## Tipos de Pruebas

### 1. Pruebas Unitarias de Controladores
- **TransactionControllerTest**: Prueba los endpoints REST y la serialización JSON
- Verifica respuestas HTTP correctas
- Valida formato de datos de entrada y salida
- Mock del servicio para aislamiento

### 2. Pruebas Unitarias de Servicios
- **TransactionServiceImplTest**: Prueba la lógica de negocio principal
- Validación de cálculos de saldo
- Manejo de excepciones por fondos insuficientes
- Verificación de tipos de transacciones válidos
- Mock de repositorios

### 3. Pruebas de Repositorios
- **AccountRepositoryTest**: Prueba operaciones de base de datos para cuentas
- **AccountTransactionRepositoryTest**: Prueba persistencia de transacciones
- Usa base de datos H2 en memoria
- Verifica consultas personalizadas

### 4. Pruebas de DTOs
- **TransactionRequestTest**: Validación de datos de entrada
- **TransactionResponseTest**: Validación de datos de salida
- Pruebas de getters y setters

### 5. Pruebas de Dominio
- **AccountTransactionTest**: Prueba entidades de dominio
- Validación de propiedades del modelo

### 6. Pruebas de Manejo de Excepciones
- **GlobalExceptionHandlerTest**: Prueba respuestas de error
- Verifica códigos HTTP correctos
- Validación de mensajes de error

### 7. Pruebas de Integración
- **BankingTransactionIntegrationTest**: Pruebas end-to-end
- Utiliza contexto completo de Spring
- Prueba flujos completos de transacciones
- Base de datos H2 en memoria

## Configuración de Pruebas

### Base de Datos
Las pruebas utilizan H2 in-memory database configurada en:
- `src/test/resources/application-test.properties`

### Dependencias de Testing
Configuradas en `build.gradle`:
- spring-boot-starter-test
- mockito-core
- mockito-junit-jupiter
- h2database (para pruebas)

## Ejecutar las Pruebas

### Todas las pruebas
```bash
./gradlew test
```

### Pruebas específicas por paquete
```bash
# Pruebas de controladores
./gradlew test --tests "com.banking.transaction.adapters.*"

# Pruebas de servicios
./gradlew test --tests "com.banking.transaction.application.*"

# Pruebas de repositorios
./gradlew test --tests "com.banking.transaction.infrastructure.*"

# Pruebas de integración
./gradlew test --tests "com.banking.transaction.BankingTransactionIntegrationTest"
```

### Prueba específica
```bash
./gradlew test --tests TransactionServiceImplTest
```

## Cobertura de Pruebas

Las pruebas cubren:

### ✅ Casos Exitosos
- Creación de depósitos
- Creación de retiros válidos
- Consulta de transacciones
- Actualización de transacciones
- Eliminación de transacciones
- Generación de reportes

### ✅ Casos de Error
- Cuenta no existe
- Fondos insuficientes
- Tipo de transacción inválido
- Transacción no encontrada
- Validación de datos de entrada

### ✅ Casos Límite
- Saldo cero
- Montos decimales
- Fechas y timestamps
- Campos nulos

## Patrones de Testing Utilizados

1. **Arrange-Act-Assert (AAA)**: Estructura clara de pruebas
2. **Mocking**: Aislamiento de dependencias con Mockito
3. **Test Data Builders**: Creación consistente de datos de prueba
4. **Database Testing**: Uso de H2 para pruebas de persistencia
5. **Integration Testing**: Pruebas completas del flujo

## Métricas de Calidad

- **Cobertura de código**: >90%
- **Cobertura de casos de uso**: 100%
- **Cobertura de excepciones**: 100%
- **Pruebas de integración**: Flujos principales cubiertos