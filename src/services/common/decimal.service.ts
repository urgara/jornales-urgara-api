import { Injectable } from '@nestjs/common';
import type {
  DecimalInput,
  DecimalNumber,
} from '../../types/common/prisma.type';

import { ValidationException } from 'src/exceptions/common';
import { Decimal } from '@prisma/client/runtime/client';

@Injectable()
export class DecimalService {
  static create(value: DecimalInput): DecimalNumber {
    return Decimal(value);
  }

  create(value: DecimalInput): DecimalNumber {
    return Decimal(value);
  }

  /**
   * Convierte a string
   */
  toString(decimal: DecimalNumber): string {
    return decimal.toString();
  }

  /**
   * Convierte a number
   */
  toNumber(decimal: DecimalNumber): number {
    return decimal.toNumber();
  }

  /**
   * Convierte a formato fijo de decimales
   */
  toFixed(decimal: DecimalNumber, decimalPlaces: number = 2): string {
    return decimal.toFixed(decimalPlaces);
  }

  /**
   * Suma dos valores decimales
   */
  add(a: DecimalNumber, b: DecimalInput): DecimalNumber {
    return a.add(b);
  }

  /**
   * Resta dos valores decimales
   */
  subtract(a: DecimalNumber, b: DecimalInput): DecimalNumber {
    return a.sub(b);
  }

  /**
   * Multiplica dos valores decimales
   */
  multiply(a: DecimalNumber, b: DecimalInput): DecimalNumber {
    return a.mul(b);
  }

  /**
   * Divide dos valores decimales
   */
  divide(a: DecimalNumber, b: DecimalInput): DecimalNumber {
    return a.div(b);
  }

  /**
   * Compara dos valores decimales
   * @returns -1 si a < b, 0 si a === b, 1 si a > b
   */
  compare(a: DecimalNumber, b: DecimalInput): number {
    return a.comparedTo(b);
  }

  /**
   * Verifica si dos valores son iguales
   */
  equals(a: DecimalNumber, b: DecimalInput): boolean {
    return a.equals(b);
  }

  /**
   * Verifica si a es mayor que b
   */
  greaterThan(a: DecimalNumber, b: DecimalInput): boolean {
    return a.greaterThan(b);
  }

  /**
   * Verifica si a es menor que b
   */
  lessThan(a: DecimalNumber, b: DecimalInput): boolean {
    return a.lessThan(b);
  }

  /**
   * Verifica si a es mayor o igual que b
   */
  greaterThanOrEqual(a: DecimalNumber, b: DecimalInput): boolean {
    return a.greaterThanOrEqualTo(b);
  }

  /**
   * Verifica si a es menor o igual que b
   */
  lessThanOrEqual(a: DecimalNumber, b: DecimalInput): boolean {
    return a.lessThanOrEqualTo(b);
  }

  /**
   * Obtiene el valor absoluto
   */
  abs(decimal: DecimalNumber): DecimalNumber {
    return decimal.abs();
  }

  /**
   * Redondea hacia arriba
   */
  ceil(decimal: DecimalNumber): DecimalNumber {
    return decimal.ceil();
  }

  /**
   * Redondea hacia abajo
   */
  floor(decimal: DecimalNumber): DecimalNumber {
    return decimal.floor();
  }

  /**
   * Redondea al entero más cercano
   */
  round(decimal: DecimalNumber): DecimalNumber {
    return decimal.round();
  }

  /**
   * Verifica si el valor es cero
   */
  isZero(decimal: DecimalNumber): boolean {
    return decimal.isZero();
  }

  /**
   * Verifica si el valor es positivo
   */
  isPositive(decimal: DecimalNumber): boolean {
    return decimal.isPositive();
  }

  /**
   * Verifica si el valor es negativo
   */
  isNegative(decimal: DecimalNumber): boolean {
    return decimal.isNegative();
  }

  /**
   * Verifica si un valor es un DecimalNumber válido
   */
  isValid(value: unknown): boolean {
    return Decimal.isDecimal(value);
  }

  /**
   * Convierte desde string validando formato
   */
  fromString(value: string): DecimalNumber {
    try {
      return Decimal(value);
    } catch {
      throw new ValidationException(`Invalid decimal string: ${value}`);
    }
  }

  /**
   * Convierte desde number validando que no sea NaN o Infinity
   */
  fromNumber(value: number): DecimalNumber {
    if (isNaN(value) || !isFinite(value)) {
      throw new ValidationException(`Invalid decimal number: ${value}`);
    }
    return Decimal(value);
  }

  /**
   * Suma un array de valores decimales
   */
  sum(values: DecimalNumber[]): DecimalNumber {
    return values.reduce((acc, val) => acc.add(val), Decimal(0));
  }

  /**
   * Obtiene el valor mínimo de un array
   */
  min(values: DecimalNumber[]): DecimalNumber {
    if (values.length === 0) {
      throw new ValidationException('Cannot get minimum of empty array');
    }

    return values.reduce((min, val) => {
      const decimal = Decimal(val);
      return decimal.lessThan(min) ? decimal : min;
    }, Decimal(values[0]));
  }

  /**
   * Obtiene el valor máximo de un array
   */
  max(values: DecimalNumber[]): DecimalNumber {
    if (values.length === 0) {
      throw new ValidationException('Cannot get maximum of empty array');
    }

    return values.reduce((max, val) => {
      const decimal = Decimal(val);
      return decimal.greaterThan(max) ? decimal : max;
    }, Decimal(values[0]));
  }

  /**
   * Calcula el promedio de un array de valores
   */
  average(values: DecimalNumber[]): DecimalNumber {
    if (values.length === 0) {
      throw new ValidationException('Cannot calculate average of empty array');
    }

    const sum = this.sum(values);
    return sum.div(values.length);
  }

  /**
   * Formatea el decimal como moneda
   */
  formatCurrency(
    decimal: DecimalNumber,
    currency: string = 'USD',
    locale: string = 'en-US',
  ): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(decimal.toNumber());
  }

  /**
   * Formatea el decimal como porcentaje
   */
  formatPercentage(decimal: DecimalNumber, decimals: number = 2): string {
    return `${decimal.mul(100).toFixed(decimals)}%`;
  }
}
