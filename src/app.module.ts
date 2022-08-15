import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles/roles.guard';
import { MailModule } from './mail/mail.module';


@Module({
  imports: [NewsModule, MailModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
}
