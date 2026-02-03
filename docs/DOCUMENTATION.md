# Urgara Jornales API - Documentación Completa

**API NestJS moderna** para un sistema de gestión de "jornales" (registros de trabajo diario) construida con las mejores prácticas arquitecturales, enfocándose en mantenibilidad, escalabilidad y experiencia del desarrollador.

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Principios Arquitecturales](#principios-arquitecturales)
- [Stack Tecnológico](#stack-tecnológico)
- [Comenzando](#comenzando)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guías de Desarrollo](#guías-de-desarrollo)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Diseño de Base de Datos](#diseño-de-base-de-datos)
- [Documentación API](#documentación-api)
- [Manejo de Errores](#manejo-de-errores)
- [Estrategia de Testing](#estrategia-de-testing)
- [Deployment](#deployment)
- [Contribución](#contribución)

## 🎯 Descripción General

Esta API implementa una **Arquitectura Function-First** con principios de **Arquitectura de Tipos Domain-Driven**, asegurando una separación limpia de responsabilidades, estructura de código mantenible y patrones de desarrollo escalables.

### Características Principales

- **Arquitectura NestJS moderna** con TypeScript
- **Autenticación JWT** con rotación de refresh tokens
- **Autorización basada en roles** con permisos jerárquicos
- **Diseño Domain-Driven** con tipos independientes del ORM
- **Validación comprehensiva** con soporte para objetos anidados
- **Patrones de respuesta genérica** para eliminar duplicación de código
- **Listo para producción** con soporte PM2 y Docker

## 🏗️ Principios Arquitecturales

### Arquitectura Function-First

**Patrón**: `src/[tipo-función]/[dominio]/` - tipo de funcionalidad primero, luego dominio

- **Regla de dominio común**: Cuando la funcionalidad es usada por 2+ dominios, mover a `[tipo-función]/common/[dominio-conceptual]/`
- **Dominios conceptuales**: Relacionado con Auth → `/auth/`, Relacionado con Network → `/network/`, verdaderamente genérico → directamente en `/common/`
- **Patrón de servicios CRUD**: Cada entidad tiene servicios separados `-create`, `-read`, `-update`, `-delete`
- **Arquitectura por capas**: Controllers → Services → Database (Prisma)

### Arquitectura de Tipos Domain-Driven

**PRINCIPIO CRÍTICO: Nunca usar tipos generados por ORM directamente fuera de la capa de abstracción de tipos**

```typescript
// ✅ CORRECTO: Abstracción de tipos de dominio
// src/types/surveyor/surveyor.type.ts
import { Surveyor as PrismaSurveyor } from 'generated/prisma';

// Capa de abstracción - el único lugar donde se importa directamente Prisma
type Surveyor = PrismaSurveyor;
type CreateSurveyor = Omit<Surveyor, 'id' | 'createdAt' | 'deletedAt'>;
type UpdateSurveyor = Partial<CreateSurveyor>;

export type { Surveyor, CreateSurveyor, UpdateSurveyor };

// ✅ CORRECTO: DTOs implementan tipos de dominio abstraídos
// src/dtos/surveyor/responses/surveyor-response.dto.ts
import { Surveyor } from 'src/types/surveyor';

export class SurveyorResponseDto implements Surveyor {
  id: string;
  name: string;
  createdAt: Date;
  deletedAt: Date | null;
}

// ❌ INCORRECTO: Importar Prisma directamente en DTOs
import { Surveyor } from 'generated/prisma';
export class SurveyorDto implements Surveyor { ... }
```

**Flujo de Dependencias**: `Prisma Schema → Capa de Abstracción de Tipos → DTOs → Controllers → Services`

### Patrón de DTOs de Respuesta

**Usar DTOs de Respuesta Genéricos para eliminar repetición:**

#### 1. GenericResponseDto - Para Respuestas Simples

```typescript
export class PortDeletedResponseDto
  extends GenericResponseDto
  implements PortDeletedResponse {}
```

#### 2. GenericDataResponseDto<T> - Para Respuestas con Datos

```typescript
export class SurveyorCreatedResponseDto
  extends GenericDataResponseDto<SurveyorEntity>
  implements SurveyorCreatedResponse
{
  @ValidateNested()
  @Type(() => SurveyorResponseDto)
  data: SurveyorResponseDto;
}
```

#### 3. Patrón IntersectionType para Listas

```typescript
export class AdminListResponseDto
  extends IntersectionType(
    GenericDataResponseDto<AdminResponseDto[]>,
    PaginationDataResponseDto,
  )
  implements AdminListResponse
{
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdminResponseDto)
  data: AdminResponseDto[];
}
```

## 🛠️ Stack Tecnológico

### Tecnologías Principales

- **Framework**: NestJS 11.x
- **Lenguaje**: TypeScript 5.x
- **Runtime**: Node.js 18+
- **Base de Datos**: PostgreSQL 15+
- **ORM**: Prisma 5.x
- **Autenticación**: JWT con hashing Argon2
- **Validación**: class-validator, class-transformer
- **Documentación**: Swagger/OpenAPI
- **Gestor de Procesos**: PM2 (producción)

### Librerías Clave

- `@nestjs/swagger` - Documentación de API
- `class-validator` - Validación de requests con soporte para objetos anidados
- `class-transformer` - Transformación de objetos con decoradores @Type
- `prisma` - ORM de base de datos con ruta personalizada (generated/prisma)
- `argon2` - Hashing seguro de contraseñas
- `jsonwebtoken` - Gestión de tokens JWT

## 🚀 Comenzando

### Prerrequisitos

- Node.js 18+
- PostgreSQL 15+
- npm o yarn

### Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd urgara-jornales-api

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de tu base de datos

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones de base de datos
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run start:dev
```

### Comandos Esenciales

```bash
# Desarrollo
npm run start:dev          # Iniciar con hot reload
npm run build             # Build para producción
npm run start:prod        # Iniciar build de producción

# Base de datos
npx prisma generate       # Generar cliente después de cambios de schema
npx prisma migrate dev    # Ejecutar migraciones en desarrollo
npx prisma migrate deploy # Desplegar migraciones en producción
npx prisma studio         # GUI de base de datos

# Aseguramiento de Calidad
npm run lint             # Ejecutar ESLint
npm run format          # Formatear con Prettier
npm test                # Ejecutar tests unitarios
npm run test:e2e        # Ejecutar tests end-to-end
npm run test:cov        # Ejecutar tests con cobertura

# Producción (PM2)
npm run pm2:start       # Iniciar con PM2
npm run pm2:restart     # Reiniciar aplicación
npm run pm2:logs        # Ver logs de la aplicación
npm run deploy          # Deploy completo: build + PM2 start + save
```

## ⚙️ Configuración

### Variables de Entorno

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/urgara_jornales_api"

# Configuración JWT
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="15m"
REFRESH_JWT_SECRET="your-refresh-secret"
REFRESH_JWT_EXPIRES_IN="7d"

# Aplicación
NODE_ENV="production"
PORT=3000

# CORS
CORS_ORIGIN="http://localhost:3000"

# Cookies
COOKIE_SECRET="your-cookie-secret"
```

### Configuración Tipada

La aplicación utiliza configuración tipada para evitar magic strings:

- `src/config/api.config.ts` - Configuración de API
- `src/config/secrets.config.ts` - Secretos JWT y autenticación
- `src/config/cookie.config.ts` - Configuración de cookies
- `src/config/config.types.ts` - Tipos TypeScript para configuración

## 📁 Estructura del Proyecto

### Organización de Directorios Function-First

```
src/
├── services/[domain]/           # Lógica de negocio por dominio
│   ├── auth/                    # Servicios de autenticación
│   ├── client/                  # Servicios de gestión de clientes
│   ├── surveyor/                # Servicios de surveyors
│   ├── port-operations/         # Servicios de operaciones portuarias
│   └── common/                  # Servicios compartidos
│       ├── database.service.ts  # Servicio Prisma personalizado
│       ├── hash.service.ts      # Hashing Argon2
│       ├── jwt-auth.service.ts  # Gestión de tokens JWT
│       └── uuid.service.ts      # Generación de UUID
├── controllers/                 # Controladores HTTP (específicos por dominio)
│   ├── auth.controller.ts       # Endpoints de autenticación
│   ├── client.controller.ts     # Gestión de clientes
│   ├── surveyor.controller.ts   # Gestión de surveyors
│   ├── port-operations.controller.ts # Operaciones portuarias
│   └── index.ts                 # Export barrel
├── dtos/[domain]/              # Objetos de transferencia de datos por dominio
│   ├── auth/
│   │   ├── requests/            # Request DTOs
│   │   └── responses/           # Response DTOs
│   ├── client/
│   │   ├── requests/
│   │   └── responses/
│   └── common/                  # Shared DTOs
│       ├── generic-response.dto.ts     # Base response patterns
│       ├── generic-data-response.dto.ts
│       └── pagination.dto.ts           # Pagination support
├── types/[domain]/             # TypeScript definitions by domain
│   ├── auth/                   # Authentication types
│   ├── client/                 # Client types
│   ├── surveyor/               # Surveyor types
│   └── common/                 # Generic types only
│       ├── pagination.type.ts  # Pagination interfaces
│       └── response.type.ts    # Generic response types
├── guards/common/auth/         # Authentication & authorization
│   ├── jwt.guard.ts           # JWT token validation
│   ├── role.guard.ts          # Role-based access control
│   └── index.ts               # Barrel export
├── decorators/common/auth/     # Auth-related decorators
│   ├── access-level.decorator.ts # @AccessLevel decorator
│   └── index.ts               # Barrel export
├── filters/common/             # Exception filters (global)
│   ├── http-exception.filter.ts     # HTTP error handling
│   ├── prisma-exception.filter.ts   # Database error handling
│   └── validation-exception.filter.ts # Validation errors
├── pipes/common/               # Validation pipes (global)
│   └── custom-validation.pipe.ts    # Enhanced validation
├── middlewares/common/network/ # Network-related middlewares
│   └── ip.middleware.ts        # IP tracking middleware
├── exceptions/common/          # Custom exceptions
│   ├── auth/                   # Auth-specific exceptions
│   │   ├── security-alert.exception.ts
│   │   ├── unauthorized.exception.ts
│   │   └── token-expired.exception.ts
│   ├── bad-request.exception.ts     # 400 errors
│   ├── not-found.exception.ts       # 404 errors
│   ├── database.exception.ts        # Database errors
│   └── validation.exception.ts      # Validation errors
└── config/                     # Application configuration
    ├── api.config.ts           # API settings
    ├── secrets.config.ts       # JWT and security
    ├── cookie.config.ts        # Cookie configuration
    └── swagger.config.ts       # API documentation
```

### Excepciones Arquitecturales

#### Excepción de Controllers

Los Controllers NO siguen el patrón de subdirectorio `[domain]/` porque cada archivo `.controller.ts` inherentemente representa un solo dominio.

#### Excepción de Types

Los subdirectorios de types son solo para organización. Los types específicos de dominio permanecen en sus respectivos subdirectorios incluso si se usan en otros lugares.

### Patrón de Capa de Servicios

Cada dominio sigue separación CRUD:

```
src/services/[domain]/
├── [entity]-create.service.ts    # Lógica de creación
├── [entity]-read.service.ts      # Lógica de lectura/consulta
├── [entity]-update.service.ts    # Lógica de actualización
├── [entity]-delete.service.ts    # Lógica de eliminación
└── index.ts                      # Exportar todos los servicios
```

### Barrel Exports

Todos los directorios usan barrel exports (`index.ts`) para imports limpios:

```typescript
// ✅ Preferred
import { JwtGuard, RoleGuard } from 'src/guards/common/auth';
import { AccessLevel } from 'src/decorators/common/auth';

// ❌ Avoid
import { JwtGuard } from 'src/guards/common/auth/jwt.guard';
import { AccessLevel } from 'src/decorators/common/auth/access-level.decorator';
```

## 🔐 Guías de Desarrollo

### Reglas de Validación de DTOs

**Todos los objetos anidados DEBEN tener decoradores de validación apropiados para la funcionalidad de `plainToInstance`:**

```typescript
// ✅ REQUIRED for nested objects
@ValidateNested()
@Type(() => CustomDto)
nestedObject: CustomDto;

// ✅ REQUIRED for arrays of objects
@ValidateNested({ each: true })
@Type(() => CustomDto)
nestedArray: CustomDto[];

// ✅ REQUIRED for response DTOs
export class EntityCreatedResponseDto
  extends GenericDataResponseDto<EntityDto>
  implements EntityCreatedResponse
{
  @ValidateNested()
  @Type(() => EntityDto)
  data: EntityDto;
}
```

### Patrón de Paginación

Usar `IntersectionType` para respuestas de listas para eliminar duplicación de código:

```typescript
export class EntityListResponseDto
  extends IntersectionType(
    GenericDataResponseDto<EntityDto[]>,
    PaginationDataResponseDto,
  )
  implements EntityListResponse
{
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntityDto)
  data: EntityDto[];
  // pagination property inherited automatically
}
```

### Reglas de Decisión Arquitectural

1. **Uso multi-dominio** → Mover a `[tipo-función]/common/[dominio-conceptual]/`
2. **Propiedad conceptual clara** → Usar dominio conceptual apropiado (`auth/`, `network/`, etc.)
3. **Funcionalidad verdaderamente genérica** → Colocar directamente en `[tipo-función]/common/`
4. **Uso de dominio único** → Mantener en `[tipo-función]/[dominio-específico]/`

## 🔐 Autenticación y Autorización

### Sistema Basado en JWT

- **Access tokens**: Corta duración (15 minutos)
- **Refresh tokens**: Larga duración (7 días), cookies HTTP-only
- **Rotación automática**: Los refresh tokens rotan en cada uso
- **Seguimiento de sesión**: Validación de sesión respaldada por base de datos

### Jerarquía de Roles

```typescript
enum AdminRole {
  ADMIN = 1, // Mayor acceso - Control total del sistema
  JORNAL = 5, // Acceso medio - Gestión de jornales
  PAYMENTS = 10, // Menor acceso - Solo operaciones de pago
}
```

**Números menores = Mayor nivel de acceso**

### Flujo de Autenticación

1. Decorador `@AccessLevel(AdminRole.ADMIN)` en controllers/métodos
2. `JwtGuard` valida JWT de cookies, maneja rotación de refresh tokens
3. `RoleGuard` verifica jerarquía de roles (número menor = mayor acceso)
4. Información del usuario adjuntada a `request.admin` para uso en servicios

### Ejemplo de Implementación

```typescript
@Controller('admin')
@AccessLevel(AdminRole.JORNAL) // Requerido para toda la clase
export class AdminController {
  @Get()
  @AccessLevel(AdminRole.ADMIN) // Override: solo ADMIN
  getAllAdmins() {}

  @Post()
  createAdmin() {} // Hereda AdminRole.JORNAL de la clase

  @Get('public')
  getPublicInfo() {} // Sin decorador = ruta pública
}
```

## 🗄️ Diseño de Base de Datos

### Principios del Schema

- **Claves primarias UUID** para todas las entidades
- **Eliminaciones lógicas** usando timestamps `deletedAt`
- **Campos de auditoría**: `createdAt`, `updatedAt`, `deletedAt`
- **Estructura normalizada** siguiendo dominios de negocio
- **Ruta Prisma personalizada**: `generated/prisma` (no por defecto)

### Gestión de Migraciones

```bash
# Crear nueva migración
npx prisma migrate dev --name descriptive-name

# Desplegar a producción
npx prisma migrate deploy

# Resetear base de datos de desarrollo
npx prisma migrate reset

# Generar cliente después de cambios de schema
npx prisma generate
```

## 📚 Documentación API

### Integración Swagger

La API está completamente documentada usando Swagger/OpenAPI:

- **Desarrollo**: `http://localhost:3000/api/docs`
- **Producción**: `https://api.example.com/api/docs`

### Formato de Respuesta Consistente

Todas las respuestas de la API siguen un formato estandarizado:

```json
{
  "success": true,
  "message": "Operación completada exitosamente",
  "data": { ... }, // Opcional, solo en respuestas con datos
  "pagination": { ... } // Opcional, solo en respuestas de listas
}
```

## ❌ Manejo de Errores

### Sistema de Excepciones

**Ubicación**: `src/exceptions/common/`

La aplicación implementa un sistema comprehensivo de manejo de errores con:

- **Clase base**: Excepciones personalizadas extendiendo `HttpException`
- **Formato consistente**: Todos los errores devuelven respuestas JSON estandarizadas
- **Excepciones específicas**: Una clase por tipo de error
- **Integración de filtros**: Transformación automática de errores

### Tipos de Errores Disponibles

- `BadRequestException` (400) - Datos de request inválidos
- `UnauthorizedException` (401) - Autenticación requerida
- `TokenExpiredException` (401) - Token JWT expirado
- `ForbiddenException` (403) - Permisos insuficientes
- `SecurityAlertException` (403) - Violaciones de seguridad
- `NotFoundException` (404) - Recurso no encontrado
- `ValidationException` (422) - Errores de validación de entrada
- `DatabaseException` (500) - Errores de operación de base de datos

### Formato de Respuesta de Errores

Todas las excepciones devuelven estructura JSON consistente:

```json
{
  "success": false,
  "message": "Error de validación en los datos proporcionados",
  "code": 400,
  "errors": {
    "email": ["El email es requerido"],
    "password": ["La contraseña debe tener al menos 8 caracteres"]
  }
}
```

### ValidationPipe Personalizado

**Ubicación**: `src/pipes/common/custom-validation.pipe.ts`

Transforma errores de class-validator al formato estándar de la aplicación con soporte apropiado para validación de objetos anidados.

## 🧪 Estrategia de Testing

### Estructura de Tests

```
src/
├── **/*.spec.ts          # Tests unitarios
test/
├── **/*.e2e-spec.ts      # Tests end-to-end
```

### Guías de Testing

1. **Tests unitarios** para servicios y utilidades
2. **Tests E2E** para endpoints de API
3. **Mock de dependencias externas** (base de datos, APIs de terceros)
4. **Probar casos extremos** y escenarios de error
5. **Mantener >80% cobertura de código**

### Ejecutar Tests

```bash
# Tests unitarios
npm test

# Tests E2E
npm run test:e2e

# Reporte de cobertura
npm run test:cov

# Modo watch
npm run test:watch
```

## 🚀 Deployment

### Producción con PM2

```bash
# Build de aplicación
npm run build

# Deploy con PM2
npm run deploy

# Comandos PM2 manuales
pm2 start dist/main.js --name "urgara-jornales-api"
pm2 save
pm2 startup
```

### Soporte Docker

El proyecto incluye configuración Docker:

- `Dockerfile` - Imagen de aplicación
- `docker-compose.yml` - Stack completo con PostgreSQL

### Variables de Entorno (Producción)

Configurar apropiadamente para producción:

- `NODE_ENV=production`
- Secretos JWT fuertes (usar generadores aleatorios seguros)
- URL de base de datos de producción
- Orígenes CORS específicos
- Configuraciones de cookies seguras

### Configuración PM2

```json
{
  "name": "urgara-jornales-api",
  "script": "dist/main.js",
  "instances": "max",
  "exec_mode": "cluster",
  "env": {
    "NODE_ENV": "production"
  }
}
```

## 🤝 Contribución

### Flujo de Desarrollo

1. **Crear branch de feature** desde `main`
2. **Seguir conventional commits** (feat, fix, refactor, etc.)
3. **Escribir tests** para nueva funcionalidad
4. **Ejecutar checks de calidad** (lint, format, test)
5. **Crear pull request** con descripción clara
6. **Asegurar que CI/CD pase** antes del merge

### Estándares de Código

- **Modo strict de TypeScript** habilitado
- **ESLint + Prettier** enforced
- **Conventional commits** requeridos
- **No tipos directos de Prisma** en capa de aplicación
- **Manejo apropiado de errores** con excepciones personalizadas
- **Documentación comprehensiva de API** con Swagger

### Formato de Mensaje de Commit

```
tipo(scope): asunto

cuerpo (opcional)

pie (opcional)
```

**Tipos**: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`

**Ejemplos**:

```
feat(auth): implement JWT refresh token rotation
fix(client): resolve validation error in contact creation
refactor(dtos): improve nested object validation for plainToInstance
docs(architecture): update response DTO patterns documentation
```

### Guías Arquitecturales

Al implementar nuevas funcionalidades:

1. **Seguir el patrón de separación de servicios CRUD**
2. **Crear DTOs apropiados con decoradores de validación**
3. **Usar @AccessLevel para autorización**
4. **Manejar errores con excepciones personalizadas**
5. **Agregar documentación Swagger con decoradores**
6. **Implementar entidades de dominio (nunca usar tipos Prisma directamente)**
7. **Usar DTOs de respuesta genéricos para eliminar duplicación**

## 📚 Recursos Adicionales

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📞 Soporte

Para preguntas, issues o contribuciones:

1. **Revisar issues existentes** en el repositorio
2. **Crear reportes de bugs detallados** con pasos de reproducción
3. **Seguir las guías de contribución**
4. **Usar mensajes de commit convencionales**

---

**Versión**: 1.0.0
**Última Actualización**: Enero 2025
**Mantenedor**: Equipo de Desarrollo Dynnamo Crypt S.A

_Esta documentación refleja las decisiones arquitecturales actuales y patrones implementados en la API Urgara Jornales. Sirve tanto como guía de desarrollo y referencia para mantener consistencia a través del codebase._
