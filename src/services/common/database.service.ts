import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DatabaseException, NotFoundException } from '../../exceptions/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../../../generated/prisma-locality';
import { DatabaseCommonService } from './database-common.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private tenantConnections = new Map<string, PrismaClient>();

  constructor(
    private readonly databaseCommonService: DatabaseCommonService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      // Cargar todas las localidades activas (deletedAt = null)
      const localities = await this.databaseCommonService.locality.findMany({
        where: { deletedAt: null },
        select: { id: true, databaseName: true, name: true },
      });

      // Obtener configuración base de la DB
      const baseUrl = this.configService.get<string>('DATABASE_LOCALITY_URL');

      if (!baseUrl) {
        throw new DatabaseException('DATABASE_LOCALITY_URL not configured');
      }

      // Crear una conexión por cada localidad
      for (const locality of localities) {
        if (!locality.databaseName || locality.databaseName === 'pending') {
          console.warn(
            `Skipping locality ${locality.name} (${locality.id}): databaseName is pending`,
          );
          continue;
        }

        // Reemplazar {locality} en la URL con el databaseName
        const tenantUrl = baseUrl.replace('{locality}', locality.databaseName);

        const pool = new Pool({ connectionString: tenantUrl });
        const adapter = new PrismaPg(pool);
        const client = new PrismaClient({ adapter });

        await client.$connect();
        this.tenantConnections.set(locality.id, client);

        console.log(
          `✓ Connected to tenant DB: ${locality.name} (${locality.databaseName})`,
        );
      }

      console.log(
        `✓ Loaded ${this.tenantConnections.size} tenant database connections`,
      );
    } catch (error) {
      throw new DatabaseException(
        `Initialization Tenant DB Error: ${error.message}`,
      );
    }
  }

  getTenantClient(localityId: string): PrismaClient {
    const client = this.tenantConnections.get(localityId);

    if (!client) {
      throw new NotFoundException(
        `Tenant database connection not found for locality: ${localityId}`,
      );
    }

    return client;
  }

  async onModuleDestroy() {
    // Cerrar todas las conexiones al destruir el módulo
    for (const [localityId, client] of this.tenantConnections.entries()) {
      await client.$disconnect();
      console.log(`✓ Disconnected tenant DB: ${localityId}`);
    }
    this.tenantConnections.clear();
  }
}
