import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { LoggingTimeInterceptor } from './interceptors/logging-time/logging-time.interceptor';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(process.cwd(),'uploads'));
  app.useGlobalInterceptors(new LoggingTimeInterceptor());
  await app.listen(3000);
}
bootstrap();
