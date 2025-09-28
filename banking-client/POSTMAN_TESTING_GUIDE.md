# 📋 Banking Client API - Postman Testing Guide

## 🎯 **Guía Completa de Testing - Puerto 8001**

Esta guía te ayudará a probar completamente el servicio **Banking Client** con los nuevos requerimientos de campos obligatorios.

### 📦 **Importar la Colección**
1. Abre Postman
2. Importa el archivo: `Banking-Client-API-Updated.postman_collection.json`
3. Los requests ya están configurados para el puerto **8001**

---

## 🔄 **Flujo de Testing Recomendado**

### 🟢 **FASE 1: CREACIÓN EXITOSA DE CLIENTES (Requests 1-3)**

#### ✅ **1. Create Client - Valid Data**
- **Propósito**: Crear cliente con todos los campos (obligatorios + opcionales)
- **Datos**: Juan Pérez García con toda la información
- **Resultado esperado**: 201 Created

#### ✅ **2. Create Client - Only Required Fields** 
- **Propósito**: Probar que los campos opcionales (gender, age, identification) no son requeridos
- **Datos**: María González López solo con campos obligatorios
- **Resultado esperado**: 201 Created

#### ✅ **3. Create Client - With Optional Fields**
- **Propósito**: Crear cliente con todos los campos incluidos los opcionales
- **Datos**: Carlos Roberto Mendoza con información completa
- **Resultado esperado**: 201 Created

---

### 🔍 **FASE 2: CONSULTAS (Requests 4-7)**

#### 📋 **4. Get All Clients**
- **Propósito**: Verificar que los 3 clientes fueron creados
- **Resultado esperado**: 200 OK con array de 3 clientes

#### 🟢 **5. Get Active Clients Only**
- **Propósito**: Filtrar solo clientes activos
- **Resultado esperado**: 200 OK con clientes donde status=true

#### 🔍 **6. Get Client by ID**
- **Propósito**: Obtener cliente específico por ID
- **URL**: `/client/1`
- **Resultado esperado**: 200 OK con datos del cliente 1

#### 🆔 **7. Get Client by Identification** 
- **Propósito**: Buscar cliente por número de identificación
- **URL**: `/client/identification/1234567890`
- **Resultado esperado**: 200 OK con datos del cliente

---

### ✏️ **FASE 3: MODIFICACIONES (Requests 8-11)**

#### 📝 **8. Update Client**
- **Propósito**: Actualizar información de cliente existente
- **Datos**: Información actualizada del cliente 1
- **Resultado esperado**: 200 OK con datos actualizados

#### ✅ **9. Activate Client**
- **Propósito**: Activar un cliente
- **URL**: `/client/1/activate`
- **Resultado esperado**: 200 OK

#### ❌ **10. Deactivate Client**
- **Propósito**: Desactivar un cliente
- **URL**: `/client/2/deactivate`
- **Resultado esperado**: 200 OK

#### 🗑️ **11. Delete Client**
- **Propósito**: Eliminar cliente del sistema
- **URL**: `/client/3`
- **Resultado esperado**: 204 No Content

---

## 🚨 **FASE 4: TESTING DE VALIDACIONES (Requests 12-18)**

### ❌ **Tests de Campos Obligatorios Faltantes**

#### **12. ERROR - Missing fullName**
- **Error esperado**: 400 Bad Request
- **Mensaje**: "Full name is required"

#### **13. ERROR - Missing address** 
- **Error esperado**: 400 Bad Request  
- **Mensaje**: "Address is required"

#### **14. ERROR - Missing phone**
- **Error esperado**: 400 Bad Request
- **Mensaje**: "Phone is required"

#### **15. ERROR - Missing password**
- **Error esperado**: 400 Bad Request
- **Mensaje**: "Password is required"

#### **16. ERROR - Missing status**
- **Error esperado**: 400 Bad Request
- **Mensaje**: "Status is required"

### ❌ **Tests de Validaciones de Formato**

#### **17. ERROR - Invalid password (too short)**
- **Error esperado**: 400 Bad Request
- **Mensaje**: "Password must be at least 4 characters long"

#### **18. ERROR - Get Non-existent Client**
- **Error esperado**: 404 Not Found
- **Mensaje**: "Client not found with ID: 999"

---

### 🏁 **FASE 5: VERIFICACIONES FINALES (Requests 19-20)**

#### ❤️ **19. Health Check**
- **Propósito**: Verificar que la aplicación está funcionando
- **Resultado esperado**: 200 OK con status "UP"

#### 📊 **20. Final State - Get All Clients**
- **Propósito**: Estado final del sistema después de todas las operaciones
- **Resultado esperado**: Lista actualizada de clientes

---

## 📋 **Resumen de Campos Obligatorios vs Opcionales**

### ✅ **CAMPOS OBLIGATORIOS**
- **fullName** (Nombres) ✓
- **address** (Dirección) ✓  
- **phone** (Teléfono) ✓
- **password** (Contraseña) ✓
- **status** (Estado) ✓

### 🔄 **CAMPOS OPCIONALES**
- **gender** (Género) - Puede ser null
- **age** (Edad) - Puede ser null
- **identification** (Identificación) - Puede ser null

### 🎯 **Valores de Gender Válidos**
- `"HOMBRE"` 
- `"MUJER"`
- `"OTRO"`

---

## 🚀 **Instrucciones de Uso**

1. **Importa la colección** en Postman
2. **Ejecuta los requests en orden** para un flujo completo
3. **Verifica las respuestas** según lo esperado en cada fase
4. **Prueba los casos de error** para validar las validaciones
5. **Confirma el estado final** del sistema

### 🎯 **URL Base**
```
http://localhost:8001/api/v1
```

### 🔧 **Puerto del Servicio**
```
8001
```

¡La colección está lista para usar! Todos los URLs están configurados directamente sin variables para facilitar el testing. 🎉