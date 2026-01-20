import { Exception, ListErrors } from './default.exception';

export class InternalServerException extends Exception {
  private static defaultMsg = 'Internal server error';
  constructor(msg?: string) {
    super(
      msg || InternalServerException.defaultMsg,
      500,
      ListErrors.INTERNAL_SERVER_ERROR,
    );
  }
}

export default InternalServerException;
