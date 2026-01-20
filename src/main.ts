import { NestFactory } from '@nestjs/core';
import CustomValidationPipe from './pipes/common/validation.pipe';
import { AppModule } from './modules/app.module';
import { SwaggerModule } from '@nestjs/swagger';
import swaggerConfig from './config/swagger.config';
import secrestsConfig from './config/secrests.config';
import cookieParser from 'cookie-parser';
import apiConfig from './config/api.config';
import metadata from './metadata';
import {
  HttpExceptionFilter,
  PrismaExceptionFilter,
  ValidationExceptionFilter,
} from './filters/common';
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new CustomValidationPipe());
    app.useGlobalFilters(
      new HttpExceptionFilter(),
      new PrismaExceptionFilter(),
      new ValidationExceptionFilter(),
    );

    await SwaggerModule.loadPluginMetadata(metadata);
    SwaggerModule.setup('docs', app, swaggerConfig(app));
    app.use(cookieParser(secrestsConfig().COOKIE_SECRET));

    const corsOrigin = apiConfig().CORS_ORIGIN;
    console.log('🔍 CORS_ORIGIN loaded from .env:', corsOrigin);
    console.log('🔍 NODE_ENV:', process.env.NODE_ENV);

    app.enableCors({
      origin: corsOrigin,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'CF-Connecting-IP'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
    });
    await app.listen(apiConfig().PORT);
  } catch (error) {
    console.log(error);
  }
}
void bootstrap();
