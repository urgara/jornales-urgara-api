import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from '../controllers/app.controller';
import secrestsConfig from '../config/secrests.config';
import apiConfig from '../config/api.config';
import { IpMiddleware } from '../middlewares/common/network';
import { AuthModule } from './auth.module';
import { CommonModule } from './common.module';
import { LocalityModule } from './locality.module';
import { WorkShiftModule } from './work-shift.module';
import { CompanyModule } from './company.module';
import { LegalEntityModule } from './legal-entity.module';
import { WorkerModule } from './worker.module';
import { WorkerAssignmentModule } from './worker-assignment.module';

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
    CompanyModule,
    LegalEntityModule,
    WorkerModule,
    WorkerAssignmentModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IpMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
