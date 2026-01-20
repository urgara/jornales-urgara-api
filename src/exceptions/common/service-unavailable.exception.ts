import { Exception, ListErrors } from './default.exception';

export class ServiceUnavailableException extends Exception {
  private static defaultMsg = 'Service temporarily unavailable';
  constructor(msg?: string) {
    super(
      msg || ServiceUnavailableException.defaultMsg,
      503,
      ListErrors.SERVICE_UNAVAILABLE,
    );
  }
}
