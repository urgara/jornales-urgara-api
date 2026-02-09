import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from '../controllers/app.controller';
import secrestsConfig from '../config/secrests.config';
import apiConfig from '../config/api.config';
import { IpMiddleware } from '../middlewares/common/network';
import { JwtGuard, LocalityGuard, RoleGuard } from '../guards/common/auth';
import { AuthModule } from './auth.module';
import { CommonModule } from './common.module';
import { LocalityModule } from './locality.module';
import { WorkShiftModule } from './work-shift.module';
import { CompanyModule } from './company.module';
// import { LegalEntityModule } from './legal-entity.module'; // COMENTADO: LegalEntity eliminado del schema
import { WorkerModule } from './worker.module';
import { WorkerAssignmentModule } from './worker-assignment.module';
import { AgencyModule } from './agency.module';
import { ProductModule } from './product.module';
import { TerminalModule } from './terminal.module';
import { WorkShiftBaseValueModule } from './work-shift-base-value.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [secrestsConfig, apiConfig],
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    AuthModule,
    LocalityModule,
    WorkShiftModule,
    WorkShiftBaseValueModule,
    CompanyModule,
    // LegalEntityModule, // COMENTADO: LegalEntity eliminado del schema
    WorkerModule,
    WorkerAssignmentModule,
    AgencyModule,
    ProductModule,
    TerminalModule,
  ],
  controllers: [AppController],
  providers: [
    // Guards globales - se ejecutan en este orden
    {
      provide: APP_GUARD,
      useClass: JwtGuard, // 1. Validar JWT y autenticación
    },
    {
      provide: APP_GUARD,
      useClass: LocalityGuard, // 2. Validar acceso por localidad
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard, // 3. Validar permisos de rol
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
