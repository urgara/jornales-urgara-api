import { Injectable } from '@nestjs/common';
import argon2 from 'argon2';
import { InternalServerException } from 'src/exceptions/common';

@Injectable()
export class HashService {
  constructor() {}

  async hash(pass: string) {
    try {
      return await argon2.hash(pass);
    } catch {
      throw new InternalServerException('Hash Error');
    }
  }

  async validation(hash: string, pass: string) {
    try {
      return await argon2.verify(hash, pass);
    } catch {
      throw new InternalServerException('Hash validation Error');
    }
  }
}
