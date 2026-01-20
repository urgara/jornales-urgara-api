import { Exception, ListErrors } from './default.exception';

export class BadRequestException extends Exception {
  private static defaultMsg = 'The request is not valid';
  constructor(msg?: string) {
    super(msg || BadRequestException.defaultMsg, 400, ListErrors.BAD_REQUEST);
  }
}
