import { Exception, ListErrors } from '../default.exception';

export class ForbiddenException extends Exception {
  private static defaultMsg = 'Access forbidden';
  constructor(msg?: string) {
    super(msg || ForbiddenException.defaultMsg, 403, ListErrors.FORBIDDEN);
  }
}
