import { Injectable } from '@nestjs/common';

@Injectable()
export class DateService {
  /**
   * Convierte una fecha a la zona horaria de Argentina (UTC-3)
   * y ajusta la hora al final del día (23:59:59.999)
   * @param date - Fecha a convertir
   * @returns Fecha ajustada al final del día en zona horaria argentina
   */
  toArgentinaEndOfDay(date: Date): Date {
    const argentinaDate = new Date(date);
    // Ajustar a zona horaria Argentina (UTC-3)
    argentinaDate.setHours(23, 59, 59, 999);
    return argentinaDate;
  }

  /**
   * Convierte una fecha a la zona horaria de Argentina (UTC-3)
   * y ajusta la hora al inicio del día (00:00:00.000)
   * @param date - Fecha a convertir
   * @returns Fecha ajustada al inicio del día en zona horaria argentina
   */
  toArgentinaStartOfDay(date: Date): Date {
    const argentinaDate = new Date(date);
    // Ajustar a zona horaria Argentina (UTC-3)
    argentinaDate.setHours(0, 0, 0, 0);
    return argentinaDate;
  }

  /**
   * Obtiene el día anterior al final del día (23:59:59.999)
   * Útil para cerrar registros vigentes cuando se crea uno nuevo
   * @param date - Fecha de referencia
   * @returns Fecha del día anterior a las 23:59:59.999
   * @example
   * // Si date = 10-12-2025, retorna 09-12-2025 23:59:59.999
   */
  toPreviousDayEndOfDay(date: Date): Date {
    const previousDay = new Date(date);
    previousDay.setDate(previousDay.getDate() - 1);
    return this.toArgentinaEndOfDay(previousDay);
  }
}
