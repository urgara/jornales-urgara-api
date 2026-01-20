import { Exception, ListErrors } from './default.exception';

export class DuplicateException extends Exception {
  private static defaultMsg = 'Duplicate entry detected';
  constructor(msg?: string) {
    super(
      msg || DuplicateException.defaultMsg,
      409,
      ListErrors.DUPLICATE_ERROR,
    );
  }
}
