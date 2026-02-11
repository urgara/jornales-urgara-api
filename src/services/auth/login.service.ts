import { Injectable } from '@nestjs/common';
import { DatabaseCommonService } from '../common/database-common.service';
import { HashService } from '../common/hash.service';
import { JwtAuthService } from './jwt-auth.service';
import { UuidService } from '../common/uuid.service';
import { UnauthorizedException } from '../../exceptions/common/auth';
import type { AdminTypeRole } from 'src/types/auth';

interface LoginDto {
  dni: string;
  password: string;
  ip: string;
  userAgent: string;
}

@Injectable()
export class LoginService {
  constructor(
    private readonly databaseService: DatabaseCommonService,
    private readonly hashService: HashService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly uuidService: UuidService,
  ) {}

  async login(loginData: LoginDto) {
    const { dni, password, ip, userAgent } = loginData;

    const admin = await this.databaseService.admin.findUnique({
      where: { dni },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValidPassword = await this.hashService.validation(
      admin.password,
      password,
    );

    if (!isValidPassword || admin.deletedAt) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const sessionId = this.uuidService.V6();

    const session = await this.databaseService.session.create({
      data: {
        id: sessionId,
        token: '',
        adminId: admin.id,
        ip,
        agent: userAgent,
      },
    });

    const clientToken = await this.jwtAuthService.createClientToken({
      id: admin.id,
      role: admin.role as AdminTypeRole, // Cast necesario por bug de Prisma 7 con @map
      localityId: admin.localityId,
      sessionId: session.id,
    });

    const refreshToken = await this.jwtAuthService.createRefreshToken();

    await this.databaseService.session.update({
      where: { id: sessionId },
      data: { token: refreshToken },
    });

    return clientToken;
  }

  async logout(sessionId: string): Promise<void> {
    await this.databaseService.session.delete({
      where: { id: sessionId },
    });
  }
}
