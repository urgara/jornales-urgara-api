import { HttpException } from '@nestjs/common';

//Si se modifica el nombre o se agrega o elimina algun error, avisar al frontend. Y en en el README.
export enum ListErrors {
  BAD_REQUEST = 'BAD_REQUEST', // 400 - Solicitud incorrecta.
  NOT_FOUND = 'NOT_FOUND', // 404 - Recurso no encontrado.
  UNAUTHORIZED = 'UNAUTHORIZED', // 401 - Falta de autenticación.
  FORBIDDEN = 'FORBIDDEN', // 403 - Autenticación correcta, pero sin permisos.
  DUPLICATE_ERROR = 'DUPLICATE_ERROR', // 409 - Conflicto por entrada duplicada. se usa en los servicios de creacion de datos, como create admin.
  DATABASE_ERROR = 'DATABASE_ERROR', // 500 - Error interno del servidor relacionado con la base de datos.
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT', // 409 - Conflicto de recurso, como intentos de actualizar algo que no permite múltiples cambios simultáneos.
  VALIDATION_ERROR = 'VALIDATION_ERROR', // 400 - Error en la validación de los datos proporcionados.
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR', // 500 - Error genérico del servidor.
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE', // 503 - El servicio no está disponible temporalmente.
  TOKEN_EXPIRED = 'TOKEN_EXPIRED', // 401 - El token de autenticación ha expirado.
  SECURITY_ALERT = 'SECURITY_ALERT', // 403 - Alerta de seguridad, como intento de acceso sospechoso.
  LOCALITY_ID_REQUIRED = 'LOCALITY_ID_REQUIRED', // 400 - El ADMIN debe especificar el parámetro localityId.
}
type ErrorMessageTypes = keyof typeof ListErrors;
export abstract class Exception extends HttpException {
  constructor(msg: string, code: number, name: ErrorMessageTypes) {
    super({ msg, name, code }, code);
  }
}
