import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';


@Injectable()
export class NewsService {
  private news: News[] = [
    {
      id: 1,
      title: 'News#1',
      text: 'News_content#1',
      author: 'Yuriy',
      date: 'Sat, 06 Aug 2022 07:12:07 GMT',
      comments: [],
    },
  ];

  createNews(createNewsDto: CreateNewsDto) {
    const news: News = {
      id: this.news.length + 1,
      title: createNewsDto.title,
      text: createNewsDto.text,
      author: 'Yuriy',
      date: new Date().toUTCString(),
      comments: [],
    };
    return this.news.push(news);
  }

  createComment(createCommentDto: CreateCommentDto) {
    const newsId = createCommentDto.newsId;
    const news = this.findNewsOne(newsId);

    const comment: Comment = {
      id: news.comments.length + 1,
      author: 'Yuriy',
      text: createCommentDto.text,
      date: new Date().toUTCString(),
      comments: [],
    };

    this.news[this.news.indexOf(news)].comments.push(comment);
    return this.findNewsOne(newsId);
  }

  createCommentToComment(commentId: number, createCommentDto: CreateCommentDto) {
    const newsId = createCommentDto.newsId;
    const news = this.findNewsOne(newsId);
    const newsComments = news.comments;
    const searchComment = this.findCommentById(newsComments, commentId);

    const comment: Comment = {
      id: searchComment.comments.length + 1,
      author: 'Yuriy',
      text: createCommentDto.text,
      date: new Date().toUTCString(),
      comments: [],
    };

    searchComment.comments.push(comment);
    return this.findNewsOne(newsId);

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

  findCommentById(comments: Comment[], id: number) {
    const comment = comments.find((comment) => comment.id === id);
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  updateNews(id: number, updateNewsDto: UpdateNewsDto) {
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
    return this.news;
  }

  updateComment(id, createCommentDto: CreateCommentDto) {
    const newsId = createCommentDto.newsId;
    const news = this.findNewsOne(newsId);
    const comment = news.comments.find((comment) => comment.id === id);
    if (!news || !comment) {
      throw new NotFoundException();
    }

    const updatedComment: Comment = {
      ...comment,
      text: createCommentDto.text,
      date: new Date().toUTCString(),
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
