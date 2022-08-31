import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { LoggingTimeInterceptor } from './interceptors/logging-time/logging-time.interceptor';
import * as expressHbs from 'express-handlebars';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingTimeInterceptor());
  app.useStaticAssets(join(process.cwd(), 'public'), {
    fallthrough: true,
  });
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.engine(
    'hbs',
    expressHbs.engine({
      layoutsDir: join(process.cwd(), 'views/layouts'),
      defaultLayout: 'layout',
      extname: 'hbs',
    }),
  );
  hbs.registerPartials(process.cwd() + '/views/partials');

  const hbsHelper = require('handlebars');

  hbsHelper.registerHelper('equal', function(context1,context2) {
    if(context1===context2){
      return context1;
    }else{
      return 'Было:'+'<s>'+ context1+'</s>'+' Стало: '+context2;
    }

  });

  app.setViewEngine('hbs');
  await app.listen(3000);
}
bootstrap();
