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
