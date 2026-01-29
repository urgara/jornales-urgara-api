# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a **NestJS API** for a "jornales" (daily work records) management system with the following key architectural principles:

### Function-First Architecture

- **Pattern**: `src/[function-type]/[domain]/` - functionality type first, then domain
- **Common domain rule**: When functionality is used by 2+ domains, move to `[function-type]/common/[conceptual-domain]/`
- **Conceptual domains**: Auth-related → `/auth/`, Network-related → `/network/`, truly generic → directly in `/common/`
- **CRUD service pattern**: Each entity has separate `-create`, `-read`, `-update`, `-delete` services
- **Layered architecture**: Controllers → Services → Database (Prisma)

### Domain-Driven Type Architecture

**CRITICAL: Never use ORM-generated types directly outside the type abstraction layer**

- **Type Abstraction Layer**: Create domain types that abstract ORM dependencies in `src/types/[domain]/`
- **Single Source of Truth**: Prisma types are imported only once per domain in the abstraction layer
- **Layered Dependencies**: `Prisma Schema → Type Abstraction Layer → DTOs → Controllers → Services`
- **ORM Independence**: Application code imports from type abstraction layer, not directly from Prisma

```typescript
// ✅ CORRECT: Type abstraction layer
// src/types/surveyor/surveyor.type.ts
import { Surveyor as PrismaSurveyor } from 'generated/prisma';

// Abstraction layer - only place where Prisma is imported directly
type Surveyor = PrismaSurveyor;
type CreateSurveyor = Omit<Surveyor, 'id' | 'createdAt' | 'deletedAt'>;
type UpdateSurveyor = Partial<CreateSurveyor>;

export type { Surveyor, CreateSurveyor, UpdateSurveyor };

// ✅ CORRECT: DTOs implement abstracted domain types
// src/dtos/surveyor/responses/surveyor-response.dto.ts
import { Surveyor } from 'src/types/surveyor';

export class SurveyorResponseDto implements Surveyor {
  id: string;
  name: string;
  createdAt: Date;
  deletedAt: Date | null;
}

// ❌ INCORRECT: Direct Prisma import in DTOs
import { Surveyor } from 'generated/prisma';
export class SurveyorDto implements Surveyor { ... }
```

### Authentication & Authorization System

- **JWT-based** with refresh tokens stored in HTTP-only cookies
- **Role hierarchy**: Admin (1) > Jornal (5) > Payments (10) - lower numbers = higher access
- **@AccessLevel decorator** on controllers/methods with automatic role checking
- **Guards chain**: JwtGuard (token validation) → RoleGuard (permission checking)

## Tech Stack & Commands

### Core Technologies

- **NestJS 11.x** + **TypeScript 5.x**
- **Prisma ORM** with **PostgreSQL**
- **JWT Authentication** with **Argon2** password hashing
- **Jest** for testing, **ESLint + Prettier** for code quality
- **PM2** for production deployment

### Essential Commands

```bash
# Development
pnpm run start:dev  # Start with hot reload
pnpm run build # Build for production
pnpm run start:prod# Start production build

# Database
pnpm prisma generate   # Generate client after schema changes
pnpm prisma migrate dev# Run migrations in development
pnpm prisma migrate deploy # Deploy migrations in production

# Quality Assurance
pnpm run lint # Run ESLint
pnpm run format  # Format with Prettier
pnpm run test# Run unit tests
pnpm run test:e2e# Run end-to-end tests
pnpm run test:cov# Run tests with coverage

# Production (PM2)
pnpm run pm2:start   # Start with PM2
pnpm run pm2:restart # Restart application
pnpm run pm2:logs# View application logs
pnpm run deploy  # Full deploy: build + PM2 start + save
```

## Project Structure Patterns

### Function-First Directory Structure with Conceptual Domains

```
src/
├── services/[domain]/   # Business logic by domain
├── controllers/ # HTTP controllers (see Controllers Exception below)
├── dtos/[domain]/  # Data transfer objects by domain
├── types/[domain]/ # TypeScript definitions (see Types Exception below)
├── guards/common/
│   └── auth/   # Authentication & authorization guards
├── filters/common/ # Exception filters (truly global)
├── pipes/common/   # Validation pipes (truly global)
├── decorators/common/
│   └── auth/   # Auth-related decorators (@AccessLevel)
├── middlewares/common/
│   └── network/# Network-related middlewares (IP tracking)
├── exceptions/common/
│   ├── auth/   # Auth-related exceptions
│   ├── bad-request.exception.ts # Generic HTTP exceptions
│   ├── not-found.exception.ts
│   └── validation.exception.ts
└── config/ # Application configuration
```

### Important Exceptions to the `common/` Rule

#### Controllers Exception

```
src/controllers/
├── auth.controller.ts  # Auth domain controller
├── surveyor.controller.ts  # Surveyor domain controller
├── legal-entity.controller.ts  # Legal entity domain controller
├── client.controller.ts# Client domain controller
└── index.ts# Barrel export
```

**Controllers do NOT follow the `[domain]/` subdirectory pattern** because:

- Each `.controller.ts` file inherently represents a single domain
- No subdirectory organization needed - the filename is the domain identifier
- No `controllers/common/` needed since controllers are domain-specific by nature

#### Types Exception

```
src/types/
├── auth/  # Auth-related types
├── surveyor/  # Surveyor-related types
├── legal-entity/  # Legal entity types
├── client/# Client types
└── common/# Truly generic types only
```

**Types subdirectories are for organization, not the "2+ domains → common" rule** because:

- Types can be imported and used across the entire application regardless of location
- Subdirectories are purely for easier identification of what the types reference
- Only `types/common/` contains truly generic types like `GenericResponse`, `GenericDataResponse`, `PaginationDto`
- Domain-specific types remain in their respective subdirectories even if used elsewhere

### Service Layer Pattern

Each domain follows CRUD separation:

```
src/services/[domain]/
  ├── [entity]-create.service.ts# Creation logic
  ├── [entity]-read.service.ts  # Read/query logic
  ├── [entity]-update.service.ts# Update logic
  ├── [entity]-delete.service.ts# Deletion logic
  └── index.ts  # Export all services
```

### DTO Architecture

Strict separation between requests and responses:

```
src/dtos/[domain]/
  ├── requests/
  │   ├── create-[entity].dto.ts
  │   ├── update-[entity].dto.ts
  │   └── [entities]-query.dto.ts   # For filtering/pagination
  └── responses/
  ├── [entity]-response.dto.ts
  ├── [entity]-list-response.dto.ts
  └── [entity]-[action]-response.dto.ts
```

### Global Components with Conceptual Domains

Components used across multiple domains organized by conceptual ownership:

#### Auth-Related Components

- **Guards**: `src/guards/common/auth/` - JwtGuard, RoleGuard
- **Decorators**: `src/decorators/common/auth/` - @AccessLevel decorator
- **Exceptions**: `src/exceptions/common/auth/` - SecurityAlertException, UnauthorizedException, ForbiddenException, TokenExpiredException

#### Network-Related Components

- **Middlewares**: `src/middlewares/common/network/` - IpMiddleware for request tracking

#### Truly Generic Components

- **Filters**: `src/filters/common/` - Exception handling filters (HTTP, Prisma, Validation)
- **Pipes**: `src/pipes/common/` - CustomValidationPipe
- **Exceptions**: `src/exceptions/common/` - BadRequestException, NotFoundException, DatabaseException, ValidationException, etc.
- **DTOs**: `src/dtos/common/` - GenericResponseDto, GenericDataResponseDto, PaginationDto, etc.
- **Services**: Domain-specific in `services/[domain]/`, shared utilities in `services/common/`

### Response DTO Pattern

**Use Generic Response DTOs to eliminate repetition**

The architecture provides two base response patterns:

#### 1. GenericResponseDto - For Simple Responses (success + message)

Used for operations that only need to confirm success without returning data:

```typescript
// ✅ CORRECT: Extend GenericResponseDto for delete operations
export class PortDeletedResponseDto
  extends GenericResponseDto
  implements PortDeletedResponse {}

// ❌ INCORRECT: Repeat success/message properties
export class PortDeletedResponseDto {
  success: boolean; // Repetitive
  message: string; // Repetitive
}
```

#### 2. GenericDataResponseDto<T> - For Data Responses (success + message + data)

Used for operations that return data along with the response:

```typescript
// ✅ CORRECT: Extend GenericDataResponseDto for data operations
export class SurveyorCreatedResponseDto
  extends GenericDataResponseDto<SurveyorEntity>
  implements SurveyorCreatedResponse
{
  @ApiProperty({
    description: 'Datos del surveyor creado',
    type: SurveyorResponseDto,
  })
  data: SurveyorResponseDto;
}

// ❌ INCORRECT: Repeat success/message properties
export class SurveyorCreatedResponseDto {
  success: boolean; // Repetitive
  message: string; // Repetitive
  data: SurveyorResponseDto;
}
```

**Response DTO Architecture Rules:**

- **Delete operations**: Extend `GenericResponseDto` (no data property needed)
- **Create/Read/Update operations**: Extend `GenericDataResponseDto<T>` and specify data property
- All response DTOs must implement their corresponding response type interfaces
- Use domain entities (`SurveyorEntity`) not Prisma types in response interfaces

### DecimalNumber Validation Pattern

**For optional Decimal fields in DTOs, use @Transform + @IsDecimalNumber**

Prisma's `Decimal` type requires special handling in DTOs. For **required** fields, use `@Type()`, but for **optional** fields, use `@Transform()` with the custom `@IsDecimalNumber()` validator.

#### Required Decimal Fields

```typescript
// ✅ CORRECT: Required decimal field
@ApiProperty({
  description: 'Tarifa base por hora del trabajador',
  example: '1500.00',
  type: 'string',
})
@IsString()
@IsDecimal()
@Type(() => (value: string) => DecimalService.create(value))
baseHourlyRate: DecimalNumber;
```

#### Optional Decimal Fields

```typescript
// ✅ CORRECT: Optional decimal field
import { Transform } from 'class-transformer';
import { IsDecimalNumber } from 'src/decorators/common';

@ApiProperty({
  description: 'Porcentaje adicional opcional (ej: 15.00 = 15%)',
  example: '15.00',
  type: 'string',
  required: false,
})
@Transform(({ value }) => (value ? DecimalService.create(value) : undefined))
@IsOptional()
@IsDecimalNumber()
additionalPercent?: DecimalNumber;

// ❌ INCORRECT: @Transform after validation
@IsOptional()
@IsDecimal() // This validates string, not DecimalNumber
@Transform(({ value }) => (value ? DecimalService.create(value) : undefined))
additionalPercent?: DecimalNumber;
```

**Execution order (top to bottom):**

1. `@Transform()` - Converts string to `DecimalNumber` (or `undefined` if no value)
2. `@IsOptional()` - Allows the field to be optional
3. `@IsDecimalNumber()` - Validates using `Decimal.isDecimal()` from Decimal.js

**Key Rules:**

- **@Transform must be first** - Transformations happen before validations
- **Use @IsDecimalNumber()** - Custom validator in `src/decorators/common/is-decimal-number.decorator.ts`
- **Type definition** - Optional decimals use `DecimalNumber?` in the type layer
- **Don't use @IsString/@IsDecimal** - These validate strings, not transformed DecimalNumber objects

#### Architecture Decision Rules

1. **Multi-domain usage** → Move to `[function-type]/common/[conceptual-domain]/`
2. **Clear conceptual ownership** → Use appropriate conceptual domain (`auth/`, `network/`, etc.)
3. **Truly generic functionality** → Place directly in `[function-type]/common/`
4. **Single domain usage** → Keep in `[function-type]/[specific-domain]/`

#### Barrel Exports (index.ts)

All directories have barrel exports for clean imports:

```typescript
// ✅ Use barrel exports (preferred)
import { AccessLevel } from 'src/decorators/common/auth';
import { JwtGuard, RoleGuard } from 'src/guards/common/auth';
import { SecurityAlertException } from 'src/exceptions/common/auth';

// ❌ Avoid direct file imports
import { AccessLevel } from 'src/decorators/common/auth/access-level.decorator';
import { JwtGuard } from 'src/guards/common/auth/jwt.guard';
```

**Key barrel files:**

- `src/exceptions/common/index.ts` - Exports all generic exceptions + auth barrel
- `src/exceptions/common/auth/index.ts` - Exports all auth exceptions
- `src/guards/common/auth/index.ts` - Exports all auth guards
- `src/decorators/common/auth/index.ts` - Exports auth decorators

### Authentication Flow

1. **@AccessLevel(AdminRole.ADMIN)** decorator on controllers/methods
2. **JwtGuard** validates JWT from cookies, handles refresh token rotation
3. **RoleGuard** checks role hierarchy (lower number = higher access)
4. User info attached to `request.admin` for use in services

## Key Implementation Notes

### Configuration

- Typed configuration in `src/config/` (no magic strings)
- Environment variables loaded through NestJS ConfigModule
- Prisma client generated to `generated/prisma` (custom path)

### Database

- **UUID primary keys** for all entities
- **Prisma migrations** in `prisma/migrations/`
- Custom Prisma service in `src/services/common/database.service.ts`

### Error Handling

- **ValidationPipe** transforms class-validator errors to custom format
- **Custom exception filters** for consistent API responses
- **Security alerts** for authentication/authorization failures

### Testing

- **Jest configuration** in package.json with `ts-jest`
- Test files: `*.spec.ts` pattern in `src/` directory
- **E2E tests** in `test/` directory with separate Jest config

When implementing new features:

1. Follow the CRUD service separation pattern
2. Create proper DTOs with validation decorators
3. Use @AccessLevel for authorization
4. Handle errors with custom exceptions
5. Add Swagger documentation with decorators
