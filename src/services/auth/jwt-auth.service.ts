import { Injectable } from '@nestjs/common';
import { JsonWebTokenError, JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SecretsConfig } from '../../config';
import {
  AdminClientToken,
  PayloadAdminDataToken,
  TokenValidate,
} from '../../types/auth';
import { InternalServerException } from 'src/exceptions/common';
import {
  ForbiddenException,
  TokenExpiredException,
} from 'src/exceptions/common/auth';

@Injectable()
export class JwtAuthService {
  private readonly secretsConfig: SecretsConfig;

  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.secretsConfig = this.configService.get<SecretsConfig>('secrets')!;
  }

  public async createClientToken(userDataToken: AdminClientToken) {
    try {
      return await this.jwt.signAsync(userDataToken, {
        expiresIn: '15m',
        secret: this.secretsConfig.JWT_SECRET_CLIENT,
      });
    } catch {
      throw new InternalServerException('Internal error - createClientToken');
    }
  }

  public async createRefreshToken() {
    try {
      return this.jwt.signAsync(
        {},
        {
          expiresIn: '8h',
          secret: this.secretsConfig.JWT_SECRET_REFRESH,
        },
      );
    } catch {
      throw new InternalServerException('Internal error - JwtAuthService');
    }
  }

  public validate(
    type: TokenValidate,
    token: string,
    options?: JwtVerifyOptions,
  ): PayloadAdminDataToken {
    try {
      if (type === 'client') {
        return this.jwt.verify(token, {
          secret: this.secretsConfig.JWT_SECRET_CLIENT,
          ...options,
        });
      } else {
        return this.jwt.verify(token, {
          secret: this.secretsConfig.JWT_SECRET_REFRESH,
          ...options,
        });
      }
    } catch (error: any) {
      if (error instanceof JsonWebTokenError) {
        if (error.name === 'TokenExpiredError')
          throw new TokenExpiredException('jwt expired');
        if (error.name === 'JsonWebTokenError')
          throw new ForbiddenException('Invalid token');
      }
      throw new InternalServerException(
        'Internal error - JwtAuthService - validate',
      );
    }
  }
}
