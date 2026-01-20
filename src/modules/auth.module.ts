import { Global, Module } from '@nestjs/common';
import { AuthController } from 'src/controllers/auth.controller';
import {
  AdminCreateService,
  AdminReadService,
  AdminUpdateService,
  AdminDeleteService,
  JwtAuthService,
  LoginService,
} from 'src/services/auth';

const global = [
  JwtAuthService,

  AdminCreateService,
  AdminReadService,
  AdminUpdateService,
  AdminDeleteService,
  LoginService,
];
@Global()
@Module({
  providers: global,
  exports: global,
  controllers: [AuthController],
})
export class AuthModule {}
