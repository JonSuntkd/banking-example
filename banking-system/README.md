# Banking System

Sistema bancario desarrollado con Angular 20.3.3 y TypeScript, siguiendo una arquitectura hexagonal con principios SOLID y Clean Code.

## 🏗️ Arquitectura

El proyecto implementa una **arquitectura hexagonal** (ports and adapters) con las siguientes capas:

### Capas de la Aplicación

- **Domain**: Entidades y reglas de negocio centrales
  - `entities/`: Modelos de dominio (Client, Account, Transaction)
  - `repositories/`: Interfaces abstractas para acceso a datos

- **Application**: Casos de uso y lógica de aplicación
  - `use-cases/`: Implementación de casos de uso siguiendo principios SOLID

- **Infrastructure**: Implementaciones concretas y servicios externos
  - `repositories/`: Servicios HTTP que implementan las interfaces del dominio
  - `services/`: Servicios adicionales como generación de PDF

- **Presentation**: Componentes de interfaz de usuario
  - `components/`: Componentes reutilizables
  - `pages/`: Páginas/vistas principales

## 🚀 Funcionalidades

### Gestión de Clientes
- ✅ Listar todos los clientes
- ✅ Crear nuevo cliente (registro básico)
- ✅ Editar información del cliente
- ✅ Activar/Desactivar cliente
- ✅ Eliminar cliente
- ✅ Búsqueda y filtrado

### Gestión de Cuentas
- ✅ Listar todas las cuentas
- ✅ Crear cuenta asociada a cliente existente
- ✅ Editar información de cuenta
- ✅ Eliminar cuenta
- ✅ Filtros por tipo y estado
- ✅ Vista de resumen con estadísticas

### Gestión de Movimientos
- ✅ Listar todas las transacciones
- ✅ Crear nueva transacción (depósito/retiro)
- ✅ Editar transacción existente
- ✅ Eliminar transacción
- ✅ Validaciones de negocio

### Reportes
- ✅ Generar reporte de movimientos por fecha
- ✅ Visualización de datos en tabla
- ✅ Exportación a PDF
- ✅ Estadísticas y resúmenes

## 🛠️ Tecnologías Utilizadas

- **Framework**: Angular 20.3.3
- **Lenguaje**: TypeScript
- **Node.js**: 22.20
- **Package Manager**: npm 11.6.1
- **Arquitectura**: Hexagonal
- **Paradigma**: MVC
- **Estilo**: CSS puro (sin frameworks)
- **PDF Generation**: jsPDF
- **Testing**: Jasmine/Karma

## 📋 Principios Aplicados

### Clean Code
- Nombres descriptivos y claros
- Funciones pequeñas y específicas
- Separación de responsabilidades
- Código autodocumentado

### Principios SOLID
- **S**: Single Responsibility - Cada clase tiene una sola responsabilidad
- **O**: Open/Closed - Abierto para extensión, cerrado para modificación
- **L**: Liskov Substitution - Los objetos son reemplazables por sus subtipos
- **I**: Interface Segregation - Interfaces específicas para cada cliente
- **D**: Dependency Inversion - Dependencias de abstracciones, no de concreciones

## 🎨 Diseño

### Layout Principal
- Header con logo del banco
- Sidebar de navegación con iconos
- Área de contenido principal
- Diseño responsive para móviles y tablets

### Características UI/UX
- Sin uso de frameworks CSS (Bootstrap, Material, etc.)
- Estilos CSS personalizados
- Interfaz intuitiva y moderna
- Feedback visual para acciones del usuario
- Loading states y manejo de errores
- Modales de confirmación

## 🔗 APIs Integradas

El sistema se conecta a los siguientes microservicios backend:

- **Cliente Service**: `http://localhost:8001/api/v1/client`
- **Account Service**: `http://localhost:8002/account`
- **Transaction Service**: `http://localhost:8003/transaction`

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── domain/
│   │   ├── entities/
│   │   └── repositories/
│   ├── application/
│   │   └── use-cases/
│   ├── infrastructure/
│   │   ├── repositories/
│   │   └── services/
│   ├── presentation/
│   │   ├── components/
│   │   └── pages/
│   │       ├── clients/
│   │       ├── accounts/
│   │       ├── transactions/
│   │       └── reports/
│   └── shared/
│       └── types/
├── styles.css
└── main.ts
```

## 🚦 Instalación y Ejecución

### Prerequisitos
- Node.js 22.20 o superior
- npm 11.6.1 o superior

### Instalación
```bash
# Navegar al directorio del proyecto
cd banking-system

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Ejecutar tests con coverage
npm run test:coverage
```

### URLs de Desarrollo
- **Frontend**: http://localhost:4200
- **Cliente API**: http://localhost:8001
- **Account API**: http://localhost:8002
- **Transaction API**: http://localhost:8003

## 🧪 Testing

El proyecto incluye pruebas unitarias para:
- Casos de uso (use cases)
- Componentes principales
- Servicios de infraestructura

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en watch mode
npm run test -- --watch
```

## 📊 Funcionalidades de Reportes

### Reporte de Movimientos
- Filtrado por fecha específica (formato DD/MM/YYYY)
- Visualización en tabla con información completa
- Estadísticas resumidas:
  - Total de movimientos
  - Cantidad de depósitos
  - Cantidad de retiros
  - Total de dinero movido
- Exportación a PDF con formato profesional

### Formato PDF
- Header con logo y fecha del reporte
- Tabla detallada de movimientos
- Resumen estadístico
- Paginación automática
- Footer con numeración de páginas

## 🔒 Validaciones Implementadas

### Clientes
- Nombre completo mínimo 2 caracteres
- Dirección mínima 5 caracteres
- Teléfono formato ecuatoriano (+593-XX-XXX-XXXX)
- Contraseña mínimo 6 caracteres
- Edad entre 18 y 120 años (opcional)

### Cuentas
- Número de cuenta mínimo 4 dígitos
- Saldo inicial no negativo
- Tipo de cuenta válido (Ahorro, Corriente, Crédito)
- Cliente existente requerido

### Transacciones
- Número de cuenta válido
- Monto mayor a 0
- Límite máximo por transacción: $10,000
- Tipo válido (Depósito, Retiro)

## 🎯 Próximas Mejoras

- [ ] Autenticación y autorización
- [ ] Validación de saldo suficiente para retiros
- [ ] Historial de cambios por entidad
- [ ] Notificaciones en tiempo real
- [ ] Dashboard con gráficos
- [ ] Filtros avanzados
- [ ] Exportación a Excel
- [ ] API de búsqueda global

## 👥 Contribución

Este proyecto sigue las mejores prácticas de desarrollo y está abierto para contribuciones que mantengan los estándares de calidad establecidos.

## 📄 Licencia

Proyecto desarrollado para demostración de arquitectura hexagonal con Angular y TypeScript.