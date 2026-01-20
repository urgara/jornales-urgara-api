import { Exception, ListErrors } from '../default.exception';

export class TokenExpiredException extends Exception {
  private static defaultMsg = 'Authentication token has expired';
  constructor(msg?: string) {
    super(
      msg || TokenExpiredException.defaultMsg,
      401,
      ListErrors.TOKEN_EXPIRED,
    );
  }
}
