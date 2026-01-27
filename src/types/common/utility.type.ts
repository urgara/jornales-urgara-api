/**
 * Utility type to convert null to undefined for DTOs
 * This is useful when Prisma types use null but DTOs use optional (undefined)
 *
 * This utility transforms properties in two ways:
 * 1. Properties that can be null → made optional (?) and null converted to undefined
 *    Example: name: string | null → name?: string | undefined
 *
 * 2. Properties that cannot be null → remain unchanged
 *    Example: city: string → city: string
 *
 * This allows DTOs to use the standard TypeScript pattern with optional properties
 * instead of using null.
 */
export type NullToUndefined<T> = {
  [P in keyof T as null extends T[P] ? P : never]?:
    | Exclude<T[P], null>
    | undefined;
} & {
  [P in keyof T as null extends T[P] ? never : P]: T[P];
};
