import { Global, Module } from '@nestjs/common';
import { AuthController } from 'src/controllers/auth.controller';
import {
  AdminCreateService,
  AdminReadService,
  AdminUpdateService,
  AdminDeleteService,
  JwtAuthService,
  LoginService,
  ChangePasswordService,
} from 'src/services/auth';

const global = [
  JwtAuthService,

  AdminCreateService,
  AdminReadService,
  AdminUpdateService,
  AdminDeleteService,
  LoginService,
  ChangePasswordService,
];
@Global()
@Module({
  providers: global,
  exports: global,
  controllers: [AuthController],
})
export class AuthModule {}
