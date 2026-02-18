import { Exception, ListErrors } from './default.exception';

export class ResourceClosedException extends Exception {
  private static defaultMsg = 'This resource is closed and cannot be modified';
  constructor(msg?: string) {
    super(
      msg || ResourceClosedException.defaultMsg,
      409,
      ListErrors.RESOURCE_CLOSED,
    );
  }
}
