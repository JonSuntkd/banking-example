# 📋 Guía de Colecciones Postman - Banking Client API

Esta carpeta contiene las colecciones de Postman para probar completamente la API de Banking Client.

## 📁 Archivos Incluidos

### 1. `Banking-Client-API.postman_collection.json`
**Colección principal** con todos los endpoints funcionales:
- ✅ Crear cliente
- ✅ Obtener cliente por ID
- ✅ Obtener cliente por identificación
- ✅ Listar todos los clientes
- ✅ Listar solo clientes activos
- ✅ Actualizar cliente
- ✅ Desactivar cliente
- ✅ Activar cliente
- ✅ Eliminar cliente

### 2. `Banking-Client-Error-Cases.postman_collection.json`
**Colección de casos de error** para validar el manejo de excepciones:
- ❌ Datos inválidos
- ❌ Identificación duplicada
- ❌ Cliente no encontrado
- ❌ Recursos inexistentes

### 3. `Banking-Client-Environment.postman_environment.json`
**Variables de entorno** para configurar:
- `baseUrl`: URL base de la API
- `clientId`: ID del cliente creado (se asigna automáticamente)
- `identification`: Identificación del cliente
- `secondClientId`: ID del segundo cliente para pruebas

## 🚀 Instrucciones de Uso

### Paso 1: Importar en Postman
1. Abrir Postman
2. Clic en **Import** (esquina superior izquierda)
3. Seleccionar los 3 archivos JSON
4. Confirmar la importación

### Paso 2: Configurar Entorno
1. En Postman, seleccionar el entorno **"Banking Client Environment"**
2. Verificar que `baseUrl` apunte a: `http://localhost:8080/api/v1`

### Paso 3: Ejecutar la Aplicación
```bash
# En el directorio del proyecto
./gradlew bootRun
```
O ejecutar con perfil de desarrollo:
```bash
./gradlew bootRun --args='--spring.profiles.active=dev'
```

### Paso 4: Ejecutar las Pruebas

#### 🟢 Flujo Normal (Colección Principal)
Ejecutar en **orden secuencial**:

1. **Create Client** → Crea el primer cliente y guarda su ID
2. **Get Client by ID** → Obtiene el cliente usando el ID guardado
3. **Get Client by Identification** → Busca por identificación
4. **Get All Clients** → Lista todos los clientes
5. **Get Active Clients Only** → Filtra solo activos
6. **Update Client** → Actualiza información del cliente
7. **Deactivate Client** → Desactiva el cliente
8. **Activate Client** → Reactiva el cliente
9. **Create Second Client** → Crea segundo cliente para pruebas
10. **Delete Client** → Elimina el segundo cliente

#### 🔴 Casos de Error (Colección de Errores)
Ejecutar después del flujo normal:
- **Create Client - Invalid Data** → Prueba validaciones
- **Create Client - Duplicate Identification** → Prueba duplicados
- **Get Client - Not Found** → Cliente inexistente
- **Update Client - Not Found** → Actualizar inexistente
- **Delete Client - Not Found** → Eliminar inexistente

## 🧪 Tests Automatizados

Cada request incluye **tests automáticos** que verifican:
- ✅ Códigos de estado HTTP correctos
- ✅ Estructura de respuesta válida
- ✅ Datos de respuesta esperados
- ✅ Variables de entorno actualizadas

### Interpretación de Resultados
- 🟢 **Verde**: Test pasó correctamente
- 🔴 **Rojo**: Test falló, revisar respuesta
- **Console**: Logs adicionales de depuración

## 📊 Ejemplos de Datos

### Cliente de Prueba 1:
```json
{
  "person": {
    "fullName": "Juan Pérez García",
    "gender": "MALE",
    "age": 35,
    "identification": "1234567890",
    "address": "Av. Principal 123, Ciudad",
    "phone": "+593-99-123-4567"
  },
  "password": "securePassword123",
  "status": true
}
```

### Cliente de Prueba 2:
```json
{
  "person": {
    "fullName": "María González López",
    "gender": "FEMALE",
    "age": 28,
    "identification": "0987654321",
    "address": "Calle Secundaria 789, Ciudad",
    "phone": "+593-98-765-4321"
  },
  "password": "mariaPassword789",
  "status": true
}
```

## 🛠️ Configuración Avanzada

### Variables Personalizadas
Puedes modificar las variables de entorno:
- `baseUrl`: Cambiar servidor (prod, dev, local)
- Agregar headers de autenticación si se implementa
- Configurar timeouts personalizados

### Ejecución por Lotes
1. Seleccionar colección completa
2. Clic en **Run Collection**
3. Configurar orden y delays
4. Ver reporte consolidado

## 🔧 Troubleshooting

### Problemas Comunes:

**1. Error de conexión**
- ✅ Verificar que la aplicación esté corriendo
- ✅ Confirmar puerto 8080 disponible
- ✅ Revisar URL base en variables

**2. Tests fallan**
- ✅ Ejecutar requests en orden secuencial
- ✅ Verificar que las variables se actualicen
- ✅ Revisar base de datos esté disponible

**3. Datos duplicados**
- ✅ Ejecutar **Delete Client** antes de crear nuevos
- ✅ Usar identificaciones únicas
- ✅ Limpiar base de datos si es necesario

## 📈 Extensiones Futuras

Estas colecciones se pueden extender para incluir:
- 🔐 Autenticación y autorización
- 📊 Tests de performance
- 🔄 Integración con pipelines CI/CD
- 📝 Documentación automática
- 🎯 Pruebas de carga con múltiples usuarios

¡Las colecciones están listas para probar completamente tu API Banking Client! 🚀