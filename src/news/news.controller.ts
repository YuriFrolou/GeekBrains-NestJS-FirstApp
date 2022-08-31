import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';


@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {
  }

  @Post()
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Post('comment')
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.newsService.createComment(createCommentDto);
  }

  @Get()
  findAll() {
    return this.newsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Patch('comment/:id')
  updateComment(@Param('id') id, @Body() createCommentDto: CreateCommentDto) {
    return this.newsService.updateComment(+id, createCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }

//Этот запрос полностью рабочий
  @Delete('comment/:commentId/:newsId')
  removeComment(@Param('commentId') commentId, @Param('newsId') newsId) {
    return this.newsService.removeComment(+commentId, +newsId);
  }

//Всегда ответ Not Found
  @Delete('comment')
  deleteComment(@Body()  body: {
    newsId: number;
    commentId: number;
  }) {
    return this.newsService.deleteComment(body);
  }
}
