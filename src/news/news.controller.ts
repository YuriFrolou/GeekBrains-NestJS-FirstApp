import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Roles } from '../decorators/roles.decorator';


@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {
  }


  @Post()
  @Roles('admin')
  createNews(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.createNews(createNewsDto);
  }

  @Post('comment')
  @Roles('user')
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.newsService.createComment(createCommentDto);
  }

  @Post('comment/:id')
  @Roles('user')
  createCommentToComment(@Param('id') id, @Body() createCommentDto: CreateCommentDto) {
    return this.newsService.createCommentToComment(+id, createCommentDto);
  }

  @Get()
  @Roles('user')
  findNewsAll() {
    return this.newsService.findNewsAll();
  }

  @Get(':id')
  @Roles('user')
  findNewsOne(@Param('id') id: string) {
    return this.newsService.findNewsOne(+id);
  }

  @Patch(':id')
  @Roles('admin')
  updateNews(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.updateNews(+id, updateNewsDto);
  }

  @Patch('comment/:id')
  @Roles('admin')
  updateComment(@Param('id') id, @Body() createCommentDto: CreateCommentDto) {
    return this.newsService.updateComment(+id, createCommentDto);
  }

  @Delete(':id')
  @Roles('admin')
  removeNews(@Param('id') id: string) {
    return this.newsService.removeNews(+id);
  }

  @Delete('comment/:commentId/:newsId')
  @Roles('admin')
  removeComment(@Param('commentId') commentId, @Param('newsId') newsId) {
    return this.newsService.removeComment(+commentId, +newsId);
  }

}
