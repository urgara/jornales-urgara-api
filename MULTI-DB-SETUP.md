# Multi-Database Setup Guide (Prisma ORM v7)

Este proyecto utiliza **dos bases de datos PostgreSQL separadas** con Prisma ORM v7.

## Estructura de Directorios

```
urgara-jornales-api/
├── prisma-common/           # DB común entre localidades
│   ├── schema.prisma
│   ├── prisma.config.ts
│   └── migrations/
├── prisma-locality/         # DB específica por localidad
│   ├── schema.prisma
│   ├── prisma.config.ts
│   └── migrations/
├── generated/
│   ├── prisma-common/       # Cliente generado para Common DB
│   └── prisma-locality/     # Cliente generado para Locality DB
└── src/services/common/
    ├── database-common.service.ts
    └── database-locality.service.ts
```

## Bases de Datos

### 1. Common Database (`common-reports-urgara`)
Base de datos compartida entre todas las localidades.

**Modelos:**
- `Admin` - Administradores del sistema
- `Session` - Sesiones de autenticación
- `Locality` - Localidades/Puertos
- `LegalEntity` - Entidades legales
- `Company` - Empresas/Compañías

**Archivos:**
- Schema: `prisma-common/schema.prisma`
- Config: `prisma-common/prisma.config.ts`
- Client: `generated/prisma-common/`
- Service: `DatabaseCommonService`

### 2. Locality Database (`{locality}-reports-urgara`)
Base de datos específica por localidad con datos operacionales.

**Modelos:**
- `WorkShift` - Turnos de trabajo
- `Worker` - Trabajadores
- `WorkerAssignment` - Asignaciones de trabajadores

**Archivos:**
- Schema: `prisma-locality/schema.prisma`
- Config: `prisma-locality/prisma.config.ts`
- Client: `generated/prisma-locality/`
- Service: `DatabaseLocalityService`

**Ejemplo de nombres de DB:**
- `mardelplata-reports-urgara`
- `buenosaires-reports-urgara`
- `rosario-reports-urgara`

## Configuración con Prisma Config (v7)

A partir de Prisma ORM v7, las URLs de base de datos se configuran en archivos `prisma.config.ts` en lugar del `datasource` block en el schema.

### prisma-common/prisma.config.ts
```typescript
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma-common/schema.prisma',
  migrations: {
    path: 'prisma-common/migrations',
  },
  datasource: {
    url: env('DATABASE_COMMON_URL'),
  },
});
```

### prisma-locality/prisma.config.ts
```typescript
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma-locality/schema.prisma',
  migrations: {
    path: 'prisma-locality/migrations',
  },
  datasource: {
    url: env('DATABASE_LOCALITY_URL'),
  },
});
```

## Variables de Entorno

```env
# Common DB - Compartida entre localidades
DATABASE_COMMON_URL=postgresql://postgres:postgres@localhost:5432/common-reports-urgara?schema=public

# Locality DB - Específica por localidad (reemplazar {locality})
DATABASE_LOCALITY_URL=postgresql://postgres:postgres@localhost:5432/{locality}-reports-urgara?schema=public

# Para Docker, cambiar @localhost:5432 por @postgres:5432
```

## Scripts NPM

### Generar Clients

```bash
# Generar ambos clients
pnpm prisma:generate:all

# Generar solo Common DB
pnpm prisma:generate:common

# Generar solo Locality DB
pnpm prisma:generate:locality
```

### Migraciones

```bash
# Crear migración para Common DB
pnpm prisma:migrate:common --name your_migration_name

# Crear migración para Locality DB
pnpm prisma:migrate:locality --name your_migration_name

# Deploy en producción
pnpm prisma:migrate:deploy:common
pnpm prisma:migrate:deploy:locality
```

### Prisma Studio

```bash
# Abrir Common DB
pnpm prisma:studio:common

# Abrir Locality DB
pnpm prisma:studio:locality
```

## Uso en Código NestJS

### Inyección de Servicios

```typescript
import { DatabaseCommonService, DatabaseLocalityService } from 'src/services/common';

@Injectable()
export class YourService {
  constructor(
    private readonly dbCommon: DatabaseCommonService,
    private readonly dbLocality: DatabaseLocalityService,
  ) {}

  async example() {
    // Acceder a Common DB
    const localities = await this.dbCommon.locality.findMany();

    // Acceder a Locality DB
    const workers = await this.dbLocality.worker.findMany();
  }
}
```

### Registro en Módulos

```typescript
import { Module } from '@nestjs/common';
import { DatabaseCommonService, DatabaseLocalityService } from 'src/services/common';

@Module({
  providers: [DatabaseCommonService, DatabaseLocalityService],
  exports: [DatabaseCommonService, DatabaseLocalityService],
})
export class YourModule {}
```

## ⚠️ Relaciones entre Bases de Datos

Las relaciones FK entre `Worker` (Locality DB) y `Locality`/`Company` (Common DB) han sido **eliminadas temporalmente** porque Prisma no soporta foreign keys entre bases de datos diferentes.

**Campos afectados en Worker:**
- `localityId` - Mantiene el ID pero sin FK constraint
- `companyId` - Mantiene el ID pero sin FK constraint

**Validación manual requerida:**
```typescript
// ❌ Prisma NO validará automáticamente estas relaciones
// ✅ Debes validar manualmente en tus servicios

async createWorker(data: CreateWorkerDto) {
  // Validar que locality existe en Common DB
  const locality = await this.dbCommon.locality.findUnique({
    where: { id: data.localityId }
  });

  if (!locality) {
    throw new NotFoundException('Locality not found');
  }

  // Validar que company existe (si se proporciona)
  if (data.companyId) {
    const company = await this.dbCommon.company.findUnique({
      where: { id: data.companyId }
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }
  }

  // Crear worker en Locality DB
  return this.dbLocality.worker.create({ data });
}
```

## Creación de Nueva Base de Datos por Localidad

Cuando necesites crear una nueva base de datos para una localidad:

```sql
-- Crear base de datos
CREATE DATABASE "mardelplata-reports-urgara";
```

```bash
# Configurar variable de entorno
DATABASE_LOCALITY_URL=postgresql://postgres:postgres@localhost:5432/mardelplata-reports-urgara?schema=public

# Ejecutar migraciones
pnpm prisma:migrate:deploy:locality
```

## Cambios Importantes en Prisma v7

1. **URLs deprecadas en schema**: Las URLs de conexión ya no van en el `datasource` block del `schema.prisma`
2. **Prisma Config requerido**: Cada base de datos necesita su archivo `prisma.config.ts`
3. **Comando --config**: Los comandos Prisma ahora usan `--config` en lugar de `--schema`

**Antes (v6):**
```bash
prisma generate --schema=prisma/schema-common.prisma
```

**Ahora (v7):**
```bash
prisma generate --config=prisma-common/prisma.config.ts
```

## Próximos Pasos

1. Configurar las variables de entorno en tu `.env`
2. Generar los clientes: `pnpm prisma:generate:all`
3. Crear las bases de datos en PostgreSQL
4. Ejecutar migraciones:
   - `pnpm prisma:migrate:common --name initial`
   - `pnpm prisma:migrate:locality --name initial`
5. Actualizar tus servicios para usar `DatabaseCommonService` y `DatabaseLocalityService`
