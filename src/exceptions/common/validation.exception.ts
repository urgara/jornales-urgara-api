import { Exception, ListErrors } from '.';

export class ValidationException extends Exception {
  private static defaultMsg = 'Validation failed';
  constructor(msg?: string) {
    super(
      msg || ValidationException.defaultMsg,
      400,
      ListErrors.VALIDATION_ERROR,
    );
  }
}
