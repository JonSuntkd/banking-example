# Banking System Frontend

Sistema bancario frontend desarrollado con Angular y TypeScript siguiendo arquitectura hexagonal y principios SOLID.

## 🏗️ Arquitectura

El proyecto implementa **Arquitectura Hexagonal** con las siguientes capas:

```
src/app/
├── domain/                 # Capa de Dominio
│   ├── entities/          # Entidades del negocio
│   └── repositories/      # Interfaces de repositorios
├── application/           # Capa de Aplicación
│   └── use-cases/        # Casos de uso del negocio
├── infrastructure/       # Capa de Infraestructura
│   └── http/            # Implementaciones HTTP
├── presentation/        # Capa de Presentación
│   └── modules/         # Módulos de Angular
└── shared/              # Recursos compartidos
```

## 🚀 Características

- ✅ **Arquitectura Hexagonal** - Separación clara de responsabilidades
- ✅ **Principios SOLID** - Código mantenible y escalable
- ✅ **Clean Code** - Código limpio y legible
- ✅ **TypeScript** - Tipado fuerte y mejor desarrollador experience
- ✅ **Angular Reactive Forms** - Formularios reactivos con validación
- ✅ **Custom CSS** - Sin frameworks externos (Material, Bootstrap, etc.)
- ✅ **Responsive Design** - Diseño adaptativo
- ✅ **Lazy Loading** - Carga perezosa de módulos
- ✅ **Error Handling** - Manejo robusto de errores
- ✅ **Loading States** - Estados de carga mejorados

## 📋 Funcionalidades

### 👥 Gestión de Clientes
- ✅ Listar todos los clientes
- ✅ Crear nuevo cliente (registro básico)
- ✅ Editar información del cliente
- ✅ Activar/Desactivar cliente
- ✅ Eliminar cliente
- ✅ Búsqueda y filtrado

### 🏦 Gestión de Cuentas
- ✅ Listar todas las cuentas
- ✅ Crear cuenta con información del cliente
- ✅ Actualizar datos de cuenta
- ✅ Eliminar cuenta
- ✅ Tipos de cuenta: Ahorro, Corriente, Crédito

### 💰 Gestión de Transacciones
- ✅ Listar todas las transacciones
- ✅ Crear nuevas transacciones (Depósito/Retiro)
- ✅ Actualizar transacciones
- ✅ Eliminar transacciones
- ✅ Validación de saldo

### 📊 Reportes
- ✅ Reporte de movimientos por fecha
- ✅ Visualización en tabla
- ✅ Exportar a PDF
- ✅ Filtros avanzados

## 🛠️ Tecnologías

- **Framework**: Angular 17
- **Lenguaje**: TypeScript
- **Estilos**: CSS3 (sin frameworks externos)
- **HTTP Client**: Angular HttpClient
- **Reactive Forms**: Angular Forms
- **Router**: Angular Router
- **RxJS**: Programación reactiva
- **PDF**: jsPDF + html2canvas

## 📡 APIs Integradas

El frontend se conecta con los siguientes microservicios:

### Cliente API (Puerto 8001)
```
GET    /api/v1/client           # Obtener todos los clientes
POST   /api/v1/client/basic     # Crear cliente básico
GET    /api/v1/client/{id}      # Obtener cliente por ID
PUT    /api/v1/client/{id}      # Actualizar cliente
PATCH  /api/v1/client/{id}/activate    # Activar cliente
PATCH  /api/v1/client/{id}/deactivate  # Desactivar cliente
DELETE /api/v1/client/{id}      # Eliminar cliente
```

### Cuenta API (Puerto 8002)
```
GET    /account                 # Obtener todas las cuentas
POST   /account/with-client     # Crear cuenta con cliente
GET    /account/{id}            # Obtener cuenta por ID
PUT    /account/{id}            # Actualizar cuenta
DELETE /account/{id}            # Eliminar cuenta
```

### Transacción API (Puerto 8003)
```
GET    /transaction             # Obtener todas las transacciones
POST   /transaction             # Crear transacción
GET    /transaction/{id}        # Obtener transacción por ID
PUT    /transaction/{id}        # Actualizar transacción
DELETE /transaction/{id}        # Eliminar transacción
GET    /transaction/report      # Reporte de movimientos
```

## 🎨 Diseño UI/UX

El diseño sigue las especificaciones de la imagen adjunta con:

- **Header**: Logo del banco y título
- **Sidebar**: Navegación principal (Clientes, Cuentas, Movimientos, Reportes)
- **Content**: Área principal con tablas, formularios y botones
- **Colors**: Esquema de colores bancario profesional
- **Typography**: Fuentes legibles y jerarquía clara
- **Spacing**: Espaciado consistente y proporcional

## 🏃‍♂️ Instalación y Ejecución

### Prerrequisitos
- Node.js (v16 o superior)
- npm (v7 o superior)
- Angular CLI

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repo-url>
   cd banking-example/frontend/banking-system
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   ng serve
   ```

4. **Abrir en navegador**
   ```
   http://localhost:4200
   ```

### Scripts Disponibles
- `npm start` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm test` - Ejecutar pruebas unitarias
- `npm run lint` - Linter de código

## 🧪 Pruebas Unitarias

El proyecto incluye pruebas unitarias para:

- ✅ **Componentes**: Todas las vistas y formularios
- ✅ **Servicios**: Casos de uso y repositorios
- ✅ **Pipes**: Transformaciones de datos
- ✅ **Guards**: Protección de rutas

### Ejecutar Pruebas
```bash
ng test                    # Ejecución única
ng test --watch           # Modo watch
ng test --code-coverage   # Con cobertura
```

## 📁 Estructura de Archivos

```
src/app/
├── domain/
│   ├── entities/
│   │   ├── client.entity.ts
│   │   ├── account.entity.ts
│   │   └── transaction.entity.ts
│   └── repositories/
│       ├── client.repository.ts
│       ├── account.repository.ts
│       └── transaction.repository.ts
├── application/
│   └── use-cases/
│       ├── client.use-cases.ts
│       ├── account.use-cases.ts
│       └── transaction.use-cases.ts
├── infrastructure/
│   └── http/
│       ├── client-http.repository.ts
│       ├── account-http.repository.ts
│       └── transaction-http.repository.ts
├── presentation/
│   └── modules/
│       ├── client/
│       │   ├── components/
│       │   │   ├── client-list/
│       │   │   └── client-form/
│       │   └── client.module.ts
│       ├── account/
│       ├── transaction/
│       └── report/
└── shared/
    ├── components/
    ├── pipes/
    └── utils/
```

## 🔄 Flujo de Datos

1. **User Interaction** → Componente (Presentation)
2. **Component** → Use Case (Application)
3. **Use Case** → Repository Interface (Domain)
4. **Repository** → HTTP Implementation (Infrastructure)
5. **HTTP** → External API
6. **Response** ← Flujo inverso

## 📝 Principios Aplicados

### SOLID
- **S** - Single Responsibility: Cada clase tiene una única razón para cambiar
- **O** - Open/Closed: Abierto para extensión, cerrado para modificación
- **L** - Liskov Substitution: Subtipos sustituibles por tipos base
- **I** - Interface Segregation: Interfaces específicas mejor que generales
- **D** - Dependency Inversion: Depender de abstracciones, no concreciones

### Clean Code
- Nombres descriptivos y significativos
- Funciones pequeñas y enfocadas
- Comentarios solo cuando es necesario
- Manejo consistente de errores
- Formateo y estructura consistente

## 🛡️ Validaciones

### Formulario de Cliente
- Nombre completo: Requerido, mínimo 2 caracteres
- Dirección: Requerido, mínimo 5 caracteres
- Teléfono: Requerido, formato válido
- Contraseña: Requerido, mínimo 6 caracteres
- Identificación: Opcional, 10-13 dígitos
- Edad: Opcional, 18-120 años

### Formulario de Cuenta
- Número de cuenta: Requerido, único
- Tipo de cuenta: Requerido (Ahorro/Corriente/Crédito)
- Saldo inicial: Requerido, no negativo
- Cliente: Requerido, existente

### Formulario de Transacción
- Número de cuenta: Requerido, existente
- Tipo: Requerido (Depósito/Retiro)
- Monto: Requerido, positivo
- Validación de saldo para retiros

## 🎯 Mejoras Futuras

- [ ] Autenticación y autorización
- [ ] Paginación en listas grandes
- [ ] Filtros avanzados
- [ ] Notificaciones toast
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (i18n)
- [ ] Optimistic UI updates
- [ ] Caching estratégico
- [ ] Websockets para tiempo real

## 📄 Licencia

Este proyecto es de uso educativo y demostrativo.

## 👨‍💻 Desarrollo

Desarrollado siguiendo las mejores prácticas de Angular y arquitectura hexagonal para crear una aplicación bancaria robusta, mantenible y escalable.