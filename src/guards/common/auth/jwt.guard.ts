import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { COOKIE_CONFIG } from '../../../config/cookie.config';
import { ApiConfig } from '../../../config';
import { JwtAuthService } from '../../../services/auth/jwt-auth.service';
import type { ReqAdmin } from '../../../types/auth/request.type';
import { SecurityAlertException } from '../../../exceptions/common/auth';
import { DatabaseCommonService } from 'src/services/common';
import { IS_PUBLIC_KEY } from '../../../decorators/common/auth';

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly apiConfig: ApiConfig;

  constructor(
    private readonly jwt: JwtAuthService,
    private readonly database: DatabaseCommonService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {
    this.apiConfig = this.configService.get<ApiConfig>('api')!;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Verificar si la ruta está marcada como pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const request: ReqAdmin = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const token: string = (request.cookies as Record<string, string>)?.[
      this.apiConfig.COOKIE_KEY_NAME
    ];
    const REQUEST_CLIENT_IP: string = request[
      this.apiConfig.REQUEST_CLIENT_IP
    ] as string;
    if (!token) {
      throw new SecurityAlertException('Token Not Found');
    }

    const { exp, ...user } = this.jwt.validate('client', token, {
      ignoreExpiration: true,
    });
    const currentTime = Math.floor(Date.now() / 1000);

    const session = await this.database.session.findFirst({
      where: { id: user.sessionId },
    });
    if (!session) {
      throw new SecurityAlertException('Session not found');
    }
    if (this.apiConfig.PROD && session.ip !== REQUEST_CLIENT_IP) {
      throw new SecurityAlertException('Denied');
    }

    if (currentTime >= exp) {
      if (!session.token) {
        throw new SecurityAlertException('Refresh token not found');
      }
      // TypeScript ahora sabe que session.refreshToken no es null después del guard
      this.jwt.validate('refresh', session.token);
      const newClientToken = await this.jwt.createClientToken(user);

      response.cookie(
        this.apiConfig.COOKIE_KEY_NAME,
        newClientToken,
        COOKIE_CONFIG,
      );
    }

    request.admin = { ...user };

    return true;
  }
}
