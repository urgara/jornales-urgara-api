import { Exception, ListErrors } from '../default.exception';

export class UnauthorizedException extends Exception {
  private static defaultMsg = 'Authentication required';
  constructor(msg?: string) {
    super(
      msg || UnauthorizedException.defaultMsg,
      401,
      ListErrors.UNAUTHORIZED,
    );
  }
}
