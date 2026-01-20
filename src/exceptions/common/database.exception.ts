import { Exception, ListErrors } from './default.exception';

export class DatabaseException extends Exception {
  private static defaultMsg = 'Database operation failed';
  constructor(msg?: string) {
    super(msg || DatabaseException.defaultMsg, 500, ListErrors.DATABASE_ERROR);
  }
}

export default DatabaseException;
