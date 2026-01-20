import { Exception, ListErrors } from '../default.exception';

export class SecurityAlertException extends Exception {
  private static defaultMsg = 'Security alert: suspicious activity detected';
  constructor(msg?: string) {
    super(
      msg || SecurityAlertException.defaultMsg,
      403,
      ListErrors.SECURITY_ALERT,
    );
  }
}
