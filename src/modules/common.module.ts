import { Global, Module } from '@nestjs/common';
import {
  DecimalService,
  UuidService,
  PdfService,
  HashService,
  DatabaseService,
  DateService,
} from '../services/common';
import { JwtService } from '@nestjs/jwt';

const global = [
  DatabaseService,
  UuidService,
  DecimalService,
  PdfService,
  HashService,
  JwtService,
  DateService,
];
@Global()
@Module({
  providers: global,
  exports: global,
})
export class CommonModule {}
