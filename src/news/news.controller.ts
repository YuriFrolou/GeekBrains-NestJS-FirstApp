import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile, Render,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Roles } from '../decorators/roles.decorator';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileFilter, FileName } from '../utils/multer.config';


@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {
  }


  @Post()
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/thumbnails',
        filename: FileName,
      }),
      fileFilter: FileFilter,
    }),
  )
  createNews(@UploadedFile() file: Express.Multer.File, @Body() createNewsDto: CreateNewsDto) {
    return this.newsService.createNews({
      ...createNewsDto,
      thumbnail: `thumbnails/${file.filename}`,
    });
  }

  @Post('comment')
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.newsService.createComment(createCommentDto);
  }

  @Post('comment/:id')
  @Roles('user')
  createCommentToComment(@Param('id') id, @Body() createCommentDto: CreateCommentDto) {
    return this.newsService.createCommentToComment(+id, createCommentDto);
  }

  @Get()
  findNewsAll() {
    return this.newsService.findNewsAll();
  }

  @Get("/render")
  @Render('news-list')
  findNewsAllRender() {
    return {
      titlePage:"Список новостей",
      news: this.newsService.findNewsAll()
    };
  }

  @Get(':id')
  @Roles('user')
  findNewsOne(@Param('id') id: string) {
    return this.newsService.findNewsOne(+id);
  }

  @Get('render-news/:id')
  @Render('news-item')
  findNewsOneRender(@Param('id') id: string) {
    return {
      titlePage:"Страница новости",
      news:this.newsService.findNewsOne(+id)
    };
  }

  @Get('render-comments/:id')
  @Render('comments-list')
  findCommentsByNews(@Param('id') id: string) {
    return {
      titlePage:"Список комментариев новости",
      comments:this.newsService.findCommentsByNews(+id)
    };
  }


  @Patch(':id')
  @Roles('admin')
  updateNews(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto) {
    return this.newsService.updateNews(+id, updateNewsDto);
  }

  @Post('add-file/:id')
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/attachments',
        filename: FileName,
      }),
    }),
  )
  addAttachmentNews(@UploadedFile() file: Express.Multer.File, @Param('id') id: string) {
    return this.newsService.addAttachmentNews(`attachments/${file.filename}`, +id);
  }

  @Patch('comment/:id')
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/attachments',
        filename: FileName,
      }),
    }),
  )
  updateComment(@UploadedFile() file: Express.Multer.File, @Param('id') id, @Body() createCommentDto: CreateCommentDto) {
    return this.newsService.updateComment(+id, {
      ...createCommentDto,
      attachment: `attachments/${file.filename}`,
    });
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
