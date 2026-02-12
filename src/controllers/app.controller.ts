import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/common/auth';

@Controller()
export class AppController {
  @Get()
  @Public()
  getHello(): string {
    return 'Urgara Jornales API 🚀';
  }
}
