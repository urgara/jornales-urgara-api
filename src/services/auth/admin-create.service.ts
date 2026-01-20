import { Injectable } from '@nestjs/common';
import { DatabaseService, HashService, UuidService } from '../common';
import type { CreateAdmin, PrismaAdmin } from 'src/types/auth';
import { DuplicateException } from 'src/exceptions/common';

@Injectable()
export class AdminCreateService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashService: HashService,
    private readonly uuidService: UuidService,
  ) {}

  async create(adminData: CreateAdmin) {
    const { name, surname, dni, password, role } = adminData;

    const existingAdmin = await this.databaseService.admin.findUnique({
      where: { dni },
    });

    if (existingAdmin) {
      throw new DuplicateException('Admin with this DNI already exists');
    }

    const hashedPassword = await this.hashService.hash(password);
    const adminId = this.uuidService.V4();

    const admin = await this.databaseService.admin.create({
      data: {
        id: adminId,
        name,
        surname,
        dni,
        password: hashedPassword,
        // Cast necesario por bug de Prisma 7 con enums mapeados
        // AdminTypeRole es 'ADMIN' | 'JORNAL' | 'PAYMENTS'
        // pero Prisma espera Role que es '1' | '5' | '10'
        role: role as unknown as PrismaAdmin['role'],
      },
    });

    return admin;
  }
}
