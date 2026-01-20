import { Exception, ListErrors } from './default.exception';

export class NotFoundException extends Exception {
  private static defaultMsg = 'Resource not found';
  constructor(msg?: string) {
    super(msg || NotFoundException.defaultMsg, 404, ListErrors.NOT_FOUND);
  }
}
