import { Injectable } from '@nestjs/common';
import { InternalServerException } from 'src/exceptions/common';
import { v4, v6 } from 'uuid';

@Injectable()
export class UuidService {
  V4(): string {
    try {
      return v4();
    } catch {
      throw new InternalServerException('Could not create uuid');
    }
  }
  V6(): string {
    try {
      return v6();
    } catch {
      throw new InternalServerException('Could not create uuid');
    }
  }
}
