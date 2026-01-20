import { Exception, ListErrors } from './default.exception';

export class ResourceConflictException extends Exception {
  private static defaultMsg = 'Resource conflict detected';
  constructor(msg?: string) {
    super(
      msg || ResourceConflictException.defaultMsg,
      409,
      ListErrors.RESOURCE_CONFLICT,
    );
  }
}
