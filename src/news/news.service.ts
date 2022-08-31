import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { MailService } from '../mail/mail.service';


@Injectable()
export class NewsService {
  private news: News[] = [];
  constructor(private readonly mailService: MailService) {
  }

  createNews(createNewsDto: CreateNewsDto) {
    const news: News = {
      id: this.news.length + 1,
      title: createNewsDto.title,
      text: createNewsDto.text,
      author: 'Yuriy',
      date: new Date().toUTCString(),
      thumbnail: createNewsDto.thumbnail,
      attachments: [],
      comments: [],
    };
    return this.news.push(news);
  }

  createComment(createCommentDto: CreateCommentDto) {
    const newsId = +createCommentDto.newsId;
    const news = this.findNewsOne(newsId);

    const comment: Comment = {
      id: news.comments.length + 1,
      author: 'Yuriy',
      text: createCommentDto.text,
      date: new Date().toUTCString(),
      attachments: [],
      comments: [],
    };

    this.news[this.news.indexOf(news)].comments.push(comment);
    return this.findNewsOne(newsId);
  }

  createCommentToComment(commentId: number, createCommentDto: CreateCommentDto) {
    const newsId = +createCommentDto.newsId;
    const news = this.findNewsOne(newsId);
    const newsComments = news.comments;
    const searchComment = this.findCommentById(newsComments, commentId);

    const comment: Comment = {
      id: searchComment.comments.length + 1,
      author: 'Yuriy',
      text: createCommentDto.text,
      date: new Date().toUTCString(),
      attachments: [],
      comments: [],
    };

    searchComment.comments.push(comment);
    return this.findNewsOne(newsId);

  }

  addAttachmentNews(attachment: string, id: number) {
      let news: News = this.findNewsOne(id);
      let attachments=news.attachments;
      attachments.push(attachment);
      news = {
      ...news,
      attachments: attachments
    };
    this.news.splice(this.news.indexOf(news), 1, news);
    return this.news;
  }

  findNewsAll() {
    return this.news;
  }


  findNewsOne(id: number) {
    const news = this.news.find((news) => news.id === id);
    if (!news) {
      throw new NotFoundException();
    }
    return news;
  }

  findCommentsByNews(id: number) {
    const news = this.news.find((news) => news.id === id);
    if (!news) {
      throw new NotFoundException();
    }
    return news.comments;
  }

  findCommentById(comments: Comment[], id: number) {
    const comment = comments.find((comment) => comment.id === id);
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  async updateNews(id: number, updateNewsDto: UpdateNewsDto) {
    const news = this.news.find((news) => news.id === id);
    if (!news) {
      throw new NotFoundException();
    }
    const updatedNews = {
      ...news,
      title: updateNewsDto.title ? updateNewsDto.title : news.title,
      text: updateNewsDto.text ? updateNewsDto.text : news.text,
      date: new Date().toUTCString(),
    };
    this.news.splice(this.news.indexOf(news), 1, updatedNews);
    await this.mailService.updateNewsLogMessage('yf_dev_test@mail.ru', [news,updatedNews]);
    return this.news;
  }

  updateComment(id, createCommentDto: CreateCommentDto) {
    const newsId = +createCommentDto.newsId;
    const news = this.findNewsOne(newsId);
    const comment = news.comments.find((comment) => comment.id === id);
    if (!news || !comment) {
      throw new NotFoundException();
    }
    if(createCommentDto.attachment){
      comment.attachments.push(createCommentDto.attachment);
    }

    const updatedComment: Comment = {
      ...comment,
      text: createCommentDto.text,
      date: new Date().toUTCString(),
      attachments: comment.attachments
    };
    news.comments.splice(news.comments.indexOf(comment), 1, updatedComment);
    this.news.splice(this.news.indexOf(news), 1, news);
    return this.findNewsOne(newsId);
  }


  removeNews(id: number) {
    const news = this.news.find((news) => news.id === id);
    if (!news) {
      throw new NotFoundException();
    }
    this.news.splice(this.news.indexOf(news), 1);
    return this.news;
  }

  removeComment(commentId, newsId) {
    const news = this.findNewsOne(newsId);
    const comment = news.comments.find((comment) => comment.id === commentId);
    if (!news || !comment) {
      throw new NotFoundException();
    }
    news.comments.splice(news.comments.indexOf(comment), 1);
    this.news.splice(this.news.indexOf(news), 1, news);
    return comment;
  }

}
