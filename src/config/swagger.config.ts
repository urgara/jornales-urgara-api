import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ErrorResponseDto,
  ValidationErrorResponseDto,
  PrismaErrorResponseDto,
} from '../dtos/common';

export default (app: INestApplication) => {
  const config = new DocumentBuilder()
    .addCookieAuth('CLIENT_TOKEN', {
      type: 'apiKey',
      in: 'cookie',
      name: 'CLIENT_TOKEN',
    })
    .setTitle('Dynnamix API')
    .setDescription(
      `
## Formato de Errores

Todos los endpoints de la API siguen un formato consistente para el manejo de errores:

### Error General (4xx, 5xx)
\`\`\`json
{
  "success": false,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/endpoint",
  "method": "POST",
  "code": 400,
  "message": "Descripción del error",
  "name": "BAD_REQUEST"
}
\`\`\`

### Error de Validación (400)
\`\`\`json
{
"success": false,
"timestamp": "2025-09-05T22:41:45.099Z",
"path": "/api/auth/login",
"method": "POST",
"code": 400,
"message": "Dto validation failed",
"name": "VALIDATION_ERROR",
"errors": {
  "dni": [
"DNI must contain only numbers",
"dni must be longer than or equal to 8 characters",
"dni should not be empty",
"dni must be a string"
  ],
  "password": [
"password is not strong enough",
"password must be a string",
"password should not be empty"
  ]
}
}
\`\`\`

**Nota sobre errores de Base de Datos:** Los errores de base de datos siguen el mismo formato que los errores generales, pero con mensajes específicos como "Unique constraint violation" y tipos como \`DUPLICATE_ERROR\`, \`NOT_FOUND\`, etc. Los códigos internos de Prisma se mapean a errores estándar por seguridad.

### Tipos de Error Disponibles (ListErrors)
- \`BAD_REQUEST\` (400) - Solicitud incorrecta
- \`NOT_FOUND\` (404) - Recurso no encontrado
- \`UNAUTHORIZED\` (401) - Falta de autenticación
- \`FORBIDDEN\` (403) - Sin permisos
- \`DUPLICATE_ERROR\` (409) - Conflicto por entrada duplicada
- \`DATABASE_ERROR\` (500) - Error interno de base de datos
- \`RESOURCE_CONFLICT\` (409) - Conflicto de recurso
- \`VALIDATION_ERROR\` (400) - Error de validación
- \`INTERNAL_SERVER_ERROR\` (500) - Error genérico del servidor
- \`SERVICE_UNAVAILABLE\` (503) - Servicio no disponible
- \`TOKEN_EXPIRED\` (401) - Token expirado
- \`SECURITY_ALERT\` (403) - Alerta de seguridad
`,
    )
    .build();

  return SwaggerModule.createDocument(app, config, {
    extraModels: [
      ErrorResponseDto,
      ValidationErrorResponseDto,
      PrismaErrorResponseDto,
    ],
  });
};
