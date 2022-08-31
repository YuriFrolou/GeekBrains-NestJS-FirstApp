import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';

@Module({
  exports:[NewsService],
  controllers: [NewsController],
  providers: [NewsService]
})
export class NewsModule {}
