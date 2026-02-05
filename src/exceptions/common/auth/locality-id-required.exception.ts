import { Exception, ListErrors } from '../default.exception';

export class LocalityIdRequiredException extends Exception {
  private static defaultMsg = 'ADMIN must specify localityId parameter';
  constructor(msg?: string) {
    super(
      msg || LocalityIdRequiredException.defaultMsg,
      400,
      ListErrors.LOCALITY_ID_REQUIRED,
    );
  }
}
