import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Decimal } from '@prisma/client/runtime/client';

@ValidatorConstraint({ async: false })
export class IsDecimalNumberConstraint implements ValidatorConstraintInterface {
  validate(value: unknown) {
    return Decimal.isDecimal(value);
  }

  defaultMessage() {
    return 'Value must be a valid DecimalNumber';
  }
}

export function IsDecimalNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDecimalNumberConstraint,
    });
  };
}
