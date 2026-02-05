import { Global, Module } from '@nestjs/common';
import {
  DecimalService,
  UuidService,
  PdfService,
  HashService,
  DatabaseCommonService,
  DatabaseLocalityService,
  DateService,
  LocalityResolverService,
} from '../services/common';
import { JwtService } from '@nestjs/jwt';

const global = [
  DatabaseCommonService,
  DatabaseLocalityService,
  UuidService,
  DecimalService,
  PdfService,
  HashService,
  JwtService,
  DateService,
  LocalityResolverService,
];
@Global()
@Module({
  providers: global,
  exports: global,
})
export class CommonModule {}
