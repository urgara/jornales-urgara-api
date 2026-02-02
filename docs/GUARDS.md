# Sistema de Guards Globales

## 📋 Resumen

Este proyecto usa **guards globales** para proteger todas las rutas automáticamente con autenticación JWT, validación de localidad y control de acceso basado en roles.

## 🔐 Guards Implementados

### 1. **JwtGuard** (Autenticación)
- Valida el JWT del cliente
- Verifica la sesión en la base de datos
- Implementa rotación automática de tokens
- Valida IP del cliente (en producción)

### 2. **LocalityGuard** (Validación de Localidad) ⭐ NUEVO
- Valida que admins LOCAL solo accedan a su localidad
- Permite acceso global a admins ADMIN (sin localityId)
- Lee `LOCALITY_ID` del `.env` para determinar la localidad de la instancia

### 3. **RoleGuard** (Autorización)
- Valida permisos basados en jerarquía de roles
- Lee el rol requerido del decorador `@AccessLevel`

## 🎯 Orden de Ejecución

```
Request → JwtGuard → LocalityGuard → RoleGuard → Controller
          ↓           ↓               ↓
       Autenticación  Localidad      Autorización
```

## 📝 Decoradores

### `@AccessLevel(role)` - Proteger ruta con rol específico

```typescript
@Get('workers')
@AccessLevel(AdminRole.LOCAL) // Requiere rol LOCAL o superior
async getWorkers() { ... }
```

**Guards ejecutados automáticamente:**
1. ✅ JwtGuard - Verifica autenticación
2. ✅ LocalityGuard - Verifica localidad
3. ✅ RoleGuard - Verifica rol >= LOCAL

### `@Public()` - Marcar ruta como pública

```typescript
@Post('login')
@Public() // Salta TODOS los guards globales
async login() { ... }
```

**Uso:** Solo para rutas sin autenticación (login, health checks, etc.)

## ⚙️ Configuración

### Variables de Entorno

```bash
# IMPORTANTE: TODAS las instancias DEBEN tener LOCALITY_ID configurado

# Instancia de Mar del Plata (localityId = 1)
LOCALITY_ID=1

# Instancia de Buenos Aires (localityId = 2)
LOCALITY_ID=2

# NOTA: NO existen instancias sin LOCALITY_ID
# Los admins ADMIN globales (sin localityId) pueden acceder a TODAS las instancias
```

### Módulo Principal

```typescript
// src/modules/app.module.ts
providers: [
  { provide: APP_GUARD, useClass: JwtGuard },      // 1° - Autenticación
  { provide: APP_GUARD, useClass: LocalityGuard }, // 2° - Localidad
  { provide: APP_GUARD, useClass: RoleGuard },     // 3° - Autorización
]
```

## 🎭 Matriz de Acceso - LocalityGuard

| Admin Role | Admin localityId | .env LOCALITY_ID | Resultado |
|------------|------------------|------------------|-----------|
| ADMIN      | `null`          | `1`              | ✅ Permitido (Admin global, acceso a todas las instancias) |
| ADMIN      | `null`          | `2`              | ✅ Permitido (Admin global, acceso a todas las instancias) |
| ADMIN      | `1`             | `1`              | ✅ Permitido (Admin con localidad coincidente) |
| ADMIN      | `1`             | `2`              | ❌ Denegado (Localidad no coincide) |
| LOCAL      | `1`             | `1`              | ✅ Permitido (Localidad coincidente) |
| LOCAL      | `1`             | `2`              | ❌ Denegado (Localidad no coincide) |
| LOCAL      | `null`          | cualquiera       | ❌ Error (LOCAL debe tener localityId asignado) |
| cualquiera | cualquiera      | `null`           | ❌ Error (Instancia mal configurada, LOCALITY_ID requerido) |

## 🔄 Flujo de Autenticación

### Login (Ruta Pública)
```
POST /auth/login
  ↓
@Public() → Salta guards
  ↓
LoginService crea JWT con { role, localityId, sessionId }
  ↓
Cookie CLIENT_TOKEN establecida
```

### Ruta Protegida
```
GET /workers
  ↓
@AccessLevel(AdminRole.LOCAL)
  ↓
1. JwtGuard → Valida JWT → request.admin = { role, localityId, sessionId }
  ↓
2. LocalityGuard → Valida localityId vs LOCALITY_ID
  ↓
3. RoleGuard → Valida role >= LOCAL
  ↓
Controller
```

## 🛡️ Seguridad

### Validación de Localidad

El `LocalityGuard` previene que:
- Admins de Mar del Plata (localityId=1) accedan a la instancia de Buenos Aires (LOCALITY_ID=2)
- Admins LOCAL sin localityId asignado accedan a cualquier instancia
- Usuarios no autorizados accedan cambiando el .env

### Validación en el JWT

El `localityId` está **dentro del JWT firmado**, por lo que:
- ❌ No se puede falsificar
- ❌ No se puede modificar sin invalidar la firma
- ✅ Es verificado en cada request

## 📚 Ejemplos

### Crear un nuevo endpoint protegido

```typescript
@Get('reports')
@AccessLevel(AdminRole.ADMIN) // Solo admins globales
async getReports() {
  // Guards ya validaron:
  // ✓ Usuario autenticado (JWT válido)
  // ✓ Localidad correcta (si aplica)
  // ✓ Rol suficiente (ADMIN)
  return this.reportsService.getAll();
}
```

### Crear una ruta pública

```typescript
@Get('health')
@Public() // Sin autenticación
async healthCheck() {
  return { status: 'ok' };
}
```

### Acceder al admin autenticado

```typescript
@Get('profile')
@AccessLevel(AdminRole.LOCAL)
async getProfile(@Req() req: ReqAdmin) {
  // request.admin está disponible (agregado por JwtGuard)
  const { role, localityId, sessionId } = req.admin;
  return this.adminService.getProfile(sessionId);
}
```

## ⚠️ Notas Importantes

1. **NO uses `@UseGuards()` manualmente** - Los guards son globales
2. **Usa `@Public()` solo cuando sea necesario** - Por defecto todo está protegido
3. **El orden de guards importa** - JwtGuard debe ejecutarse antes que LocalityGuard
4. **LocalityGuard lee del JWT** - No de la base de datos (performance)
5. **Admins ADMIN globales** - Tienen acceso a todas las instancias

## 🚀 Deploy Multi-Localidad

**IMPORTANTE:** Todas las instancias DEBEN tener `LOCALITY_ID` configurado.

### Instancia 1: Mar del Plata
```bash
# .env
DATABASE_COMMON_URL=postgresql://...common-reports-urgara
DATABASE_LOCALITY_URL=postgresql://...mardelplata-reports-urgara
LOCALITY_ID=1
PORT=3000
```

### Instancia 2: Buenos Aires
```bash
# .env
DATABASE_COMMON_URL=postgresql://...common-reports-urgara
DATABASE_LOCALITY_URL=postgresql://...buenosaires-reports-urgara
LOCALITY_ID=2
PORT=3001
```

### Acceso de Admins

- **Admin GLOBAL** (role=ADMIN, localityId=null) → Puede acceder a AMBAS instancias
- **Admin LOCAL de Mar del Plata** (role=LOCAL, localityId=1) → Solo puede acceder a instancia 1
- **Admin LOCAL de Buenos Aires** (role=LOCAL, localityId=2) → Solo puede acceder a instancia 2

---

**Última actualización:** 2025-02-02
