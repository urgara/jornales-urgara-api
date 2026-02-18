# Explicación del Sistema de Asignaciones de Trabajadores

## Arquitectura del Sistema

El sistema de asignaciones de trabajadores gestiona el cálculo de jornales basándose en valores base predefinidos, coeficientes de turno y porcentajes adicionales opcionales.

## Tabla de Valores Base (Ejemplo Real de URGARA)

Esta es la tabla proporcionada por URGARA que se utiliza para cargar los valores base en el sistema:

| COEFICIENTE | Dic 2025 Jornal | Ene 2026 No Rem | Ene 2026 Jornal |
|-------------|-----------------|-----------------|-----------------|
| **1.00**    | $176,819        | $10,609         | $187,428        |
| **1.50**    | $265,228        | $15,914         | $281,142        |
| **2.00**    | $353,637        | $21,218         | $374,855        |
| **2.25**    | $397,842        | $23,871         | $421,712        |

### Cómo interpretar esta tabla

1. **Cada columna** representa un período de vigencia con su valor remunerado y no remunerado
2. **Cada fila** representa un coeficiente (1.00, 1.50, 2.00, 2.25)
3. Los valores ya están **pre-calculados** por URGARA para cada combinación

### Ejemplo de carga en el sistema

**Para Enero 2026:**

```json
// 1. Crear WorkShiftBaseValue
POST /work-shift-base-values
{
  "remunerated": "176819.00",
  "notRemunerated": "10609.00",
  "startDate": "2026-01-01T00:00:00Z",
  "endDate": "2026-01-31T23:59:59Z",
  "category": "IDONEO"
}
// Response: { "id": "base-value-uuid-ene-2026" }

// 2. Crear WorkShiftCalculatedValue para cada coeficiente
POST /work-shift-calculated-values
[
  {
    "workShiftBaseValueId": "base-value-uuid-ene-2026",
    "coefficient": "1.00",
    "remunerated": "176819.00",
    "notRemunerated": "10609.00"
  },
  {
    "workShiftBaseValueId": "base-value-uuid-ene-2026",
    "coefficient": "1.50",
    "remunerated": "265228.00",
    "notRemunerated": "15914.00"
  },
  {
    "workShiftBaseValueId": "base-value-uuid-ene-2026",
    "coefficient": "2.00",
    "remunerated": "353637.00",
    "notRemunerated": "21218.00"
  },
  {
    "workShiftBaseValueId": "base-value-uuid-ene-2026",
    "coefficient": "2.25",
    "remunerated": "397842.00",
    "notRemunerated": "23871.00"
  }
]
```

### Cálculo real con estos valores

**Escenario: Asignación en Enero 2026 con coeficiente 1.50**

```typescript
// 1. Se busca el WorkShiftCalculatedValue
coefficient = 1.50
workShiftBaseValueId = "base-value-uuid-ene-2026"

// 2. Se obtienen los valores
remunerated = 265,228.00
notRemunerated = 15,914.00

// 3. Se obtiene gross y net desde calculatedValue
gross = calculatedValue.gross  // 281,142.00
net = calculatedValue.net      // (265,228.00 * 0.795) + (15,914.00 * 0.965) = 225,870.87

// 4. Se aplica additionalPercent al net (si existe)
// Ejemplo con +10%
additionalPercent = 10.00
percentAmount = 225,870.87 × 0.10 = 22,587.09
net = 225,870.87 + 22,587.09 = 248,457.96
```

**Resultado final guardado:**
```json
{
  "workShiftBaseValueId": "base-value-uuid-ene-2026",
  "coefficient": "1.50",
  "gross": "281142.00",          // calculatedValue.gross
  "additionalPercent": "10.00",   // +10%
  "net": "248457.96"             // calculatedValue.net + 10%
}
```

## Modelos de Datos

### 1. Worker (Trabajador)
```prisma
model Worker {
  id         String   @id @db.Uuid
  name       String   @db.VarChar(100)
  surname    String   @db.VarChar(100)
  dni        String   @unique @db.VarChar(10)
  localityId String   @db.Uuid
  category   Category // IDONEO o PERITO

  createdAt DateTime  @default(now())
  deletedAt DateTime?
}
```

**Nota importante:** El trabajador **NO tiene precio por hora**. El cálculo se basa completamente en los valores configurados en `WorkShiftBaseValue` y `WorkShiftCalculatedValue`.

### 2. WorkShift (Turno)
```prisma
model WorkShift {
  id              String       @id @db.Uuid
  days            DayOfWeek[]  // M, T, W, Th, F, S, Su
  startTime       DateTime     @db.Time
  endTime         DateTime     @db.Time
  durationMinutes Int
  coefficient     Decimal      @db.Decimal(5, 2) // ej: 1.50, 2.00
  description     String?
}
```

### 3. WorkShiftBaseValue (Valor Base del Turno)
```prisma
model WorkShiftBaseValue {
  id             String   @id @db.Uuid
  remunerated    Decimal  @db.Decimal(8, 2)    // Parte remunerada
  notRemunerated Decimal  @db.Decimal(8, 2)    // Parte no remunerada
  startDate      DateTime @db.Timestamptz()
  endDate        DateTime @db.Timestamptz()
  category       Category // IDONEO o PERITO
}
```

### 4. WorkShiftCalculatedValue (Valores Calculados)
```prisma
model WorkShiftCalculatedValue {
  workShiftBaseValueId String  @db.Uuid
  coefficient          Decimal @db.Decimal(5, 2)
  remunerated          Decimal @db.Decimal(8, 2)
  notRemunerated       Decimal @db.Decimal(8, 2)

  @@id([coefficient, workShiftBaseValueId])
}
```

Este modelo pre-calcula los valores para cada combinación de `WorkShiftBaseValue` + `coefficient`.

### 5. WorkerAssignment (Asignación)
```prisma
model WorkerAssignment {
  id                   String   @id @db.Uuid
  workerId             String   @db.Uuid
  workShiftId          String   @db.Uuid
  date                 DateTime @db.Date
  category             Category
  workShiftBaseValueId String   @db.Uuid
  coefficient          Decimal  @db.Decimal(5, 2)
  gross                Decimal  @db.Decimal(10, 2)    // calculatedValue.gross (si JC: * 0.70)
  additionalPercent    Decimal? @db.Decimal(5, 2)     // puede ser +/-
  net                  Decimal  @db.Decimal(10, 2)    // calculatedValue.net (si JC: * 0.70) + porcentaje adicional

  // IDs de contexto
  companyId   String
  localityId  String
  agencyId    String
  terminalId  String
  productId   String

  createdAt DateTime @default(now())
}
```

## Flujo de Cálculo

### Paso 1: Entrada de datos
El frontend envía:
```json
{
  "workerId": "uuid",
  "workShiftId": "uuid",
  "date": "2026-02-15",
  "category": "IDONEO",
  "value": {
    "workShiftBaseValueId": "uuid",
    "coefficient": "1.5"
  },
  "additionalPercent": "15.00",  // Opcional, puede ser negativo
  "companyId": "uuid",
  "localityId": "uuid",
  "agencyId": "uuid",
  "terminalId": "uuid",
  "productId": "uuid"
}
```

### Paso 2: Buscar el valor calculado
El sistema busca en `WorkShiftCalculatedValue` usando la clave compuesta:
- `workShiftBaseValueId`
- `coefficient`

```typescript
const calculatedValue = await db.workShiftCalculatedValue.findUnique({
  where: {
    coefficient_workShiftBaseValueId: {
      coefficient: "1.5",
      workShiftBaseValueId: "uuid"
    }
  }
});
```

### Paso 3: Obtener gross y net desde calculatedValue
```typescript
gross = calculatedValue.gross  // remunerated + notRemunerated
net = calculatedValue.net      // (remunerated * 0.795) + (notRemunerated * 0.965)

// Si Jornal Caído (JC):
if (jc) {
  gross = gross * 0.70
  net = net * 0.70
}
```

**Ejemplo:**
- `calculatedValue.gross` = 12,000.00
- `calculatedValue.net` = 9,870.00
- **`gross`** = **12,000.00**
- **`net`** = **9,870.00**

### Paso 4: Aplicar porcentaje adicional al net (si existe)
```typescript
if (additionalPercent) {
  percentAmount = net * (additionalPercent / 100)
  net = net + percentAmount
}
```

**Ejemplo 1: Porcentaje positivo (+15%)**
- `net` = 9,870.00
- `additionalPercent` = 15.00
- `percentAmount` = 9,870 × 0.15 = 1,480.50
- **`net`** = 9,870 + 1,480.50 = **11,350.50**

**Ejemplo 2: Porcentaje negativo (-10%)**
- `net` = 9,870.00
- `additionalPercent` = -10.00
- `percentAmount` = 9,870 × -0.10 = -987.00
- **`net`** = 9,870 + (-987) = **8,883.00**

**Ejemplo 3: Sin porcentaje**
- `net` = 9,870.00
- `additionalPercent` = null
- **`net`** = **9,870.00**

### Paso 5: Guardar en base de datos
```typescript
await db.workerAssignment.create({
  data: {
    id: uuidV6(),
    workerId,
    workShiftId,
    date: new Date(date),
    category,
    workShiftBaseValueId,
    coefficient,
    gross,                  // 12,000.00
    additionalPercent,      // 15.00 o null
    net,                    // 11,350.50
    companyId,
    localityId,
    agencyId,
    terminalId,
    productId,
  }
});
```

## Endpoints API

### POST /worker-assignments
Crea una nueva asignación.

**Request:**
```json
{
  "workerId": "123e4567-e89b-12d3-a456-426614174000",
  "workShiftId": "234e5678-e89b-12d3-a456-426614174001",
  "date": "2026-02-15",
  "category": "IDONEO",
  "value": {
    "workShiftBaseValueId": "345e6789-e89b-12d3-a456-426614174002",
    "coefficient": "1.5"
  },
  "additionalPercent": "15.00",
  "companyId": "456e7890-e89b-12d3-a456-426614174003",
  "localityId": "567e8901-e89b-12d3-a456-426614174004",
  "agencyId": "678e9012-e89b-12d3-a456-426614174005",
  "terminalId": "789e0123-e89b-12d3-a456-426614174006",
  "productId": "890e1234-e89b-12d3-a456-426614174007"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Worker assignment created successfully",
  "data": {
    "id": "uuid",
    "workerId": "uuid",
    "workShiftId": "uuid",
    "date": "2026-02-15",
    "category": "IDONEO",
    "workShiftBaseValueId": "uuid",
    "coefficient": "1.50",
    "gross": "12000.00",
    "additionalPercent": "15.00",
    "net": "11350.50",
    "companyId": "uuid",
    "localityId": "uuid",
    "agencyId": "uuid",
    "terminalId": "uuid",
    "productId": "uuid",
    "createdAt": "2026-02-15T10:30:00Z"
  }
}
```

### GET /worker-assignments
Lista todas las asignaciones con filtros y paginación.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `sortBy` (default: "createdAt")
- `sortOrder` (default: "desc")
- `workerId` (opcional)
- `workShiftId` (opcional)
- `companyId` (opcional)
- `agencyId` (opcional)
- `terminalId` (opcional)
- `productId` (opcional)
- `dateFrom` (opcional, formato: YYYY-MM-DD)
- `dateTo` (opcional, formato: YYYY-MM-DD)
- `localityId` (opcional)

### GET /worker-assignments/:id
Obtiene una asignación por ID, incluyendo relaciones con Worker y WorkShift.

### PATCH /worker-assignments/:id
Actualiza una asignación existente. Recalcula automáticamente `gross` y `net` si se modifican los campos relevantes.

### GET /worker-assignments/count
Retorna el total de asignaciones para una localidad.

## Campos Importantes en la Respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `category` | enum | "IDONEO" o "PERITO" |
| `workShiftBaseValueId` | UUID | ID del valor base usado para el cálculo |
| `coefficient` | string | Coeficiente del turno (ej: "1.50") |
| `gross` | string | Valor bruto: calculatedValue.gross (si JC: * 0.70) |
| `additionalPercent` | string\|null | Porcentaje adicional (puede ser negativo) |
| `net` | string | Valor neto: calculatedValue.net (si JC: * 0.70) + porcentaje adicional |

## Validaciones

1. **Worker debe existir** y no estar eliminado (`deletedAt = null`)
2. **WorkShift debe existir** y no estar eliminado
3. **WorkShiftCalculatedValue debe existir** para la combinación de `coefficient` + `workShiftBaseValueId`
4. **Fecha** debe estar en formato `YYYY-MM-DD`
5. **Category** debe ser `IDONEO` o `PERITO`
6. **additionalPercent** es opcional, puede ser positivo o negativo

## Casos de Uso

### 1. Asignación estándar (sin porcentaje adicional)
Un trabajador con turno normal sin bonificaciones ni descuentos.
```
gross = 12,000.00
net = 9,870.00
additionalPercent = null
```

### 2. Asignación con bonificación (+15%)
Un trabajador con buen desempeño recibe 15% adicional sobre el neto.
```
gross = 12,000.00
net = 9,870.00 + 15% = 11,350.50
additionalPercent = 15.00
```

### 3. Asignación con descuento (-10%)
Un trabajador con ausencia parcial recibe 10% menos sobre el neto.
```
gross = 12,000.00
net = 9,870.00 - 10% = 8,883.00
additionalPercent = -10.00
```

## Arquitectura de Código

### Servicios
- `WorkerAssignmentCreateService` - Creación de asignaciones
- `WorkerAssignmentReadService` - Lectura y consultas
- `WorkerAssignmentUpdateService` - Actualización con recálculo automático

### DTOs
- `CreateWorkerAssignmentDto` - Validación de entrada
- `WorkerAssignmentResponseDto` - Transformación de salida
- `WorkerAssignmentWithRelationsDto` - Respuesta con relaciones

### Tipos
- `CreateWorkerAssignment` - Tipo para creación
- `UpdateWorkerAssignment` - Tipo para actualización
- `SimpleWorkerAssignmentResponse` - Tipo de respuesta simple
- `WorkerAssignmentWithRelations` - Tipo de respuesta con relaciones

## Notas Técnicas

1. **Decimal.js**: Todos los cálculos monetarios usan `DecimalService` para evitar problemas de precisión con flotantes.

2. **Inmutabilidad**: Las asignaciones son registros históricos y **no se eliminan** (no tienen `deletedAt`).

3. **Timezone**: Las fechas de asignación se normalizan a la zona horaria de Argentina (UTC-3).

4. **UUIDs**: Se usa UUIDv6 para IDs ordenados cronológicamente.

5. **Multi-tenant**: Cada localidad tiene su propia base de datos (schema separado).

## Migraciones Pendientes

Para aplicar los cambios en la base de datos:

```bash
pnpm prisma migrate dev --schema=prisma-locality/schema.prisma --name add_worker_assignment_calculated_fields
```

Esto creará una migración que:
- Elimina `baseHourlyRate` de `Worker`
- Agrega `category`, `workShiftBaseValueId`, `coefficient`, `gross` a `WorkerAssignment`
- Actualiza el campo `additionalPercent` para soportar negativos
