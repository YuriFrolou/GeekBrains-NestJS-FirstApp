import { Comment } from './comment.entity';

export class News {
  id: number;
  title: string;
  text: string;
  author: string;
  date: string;
  thumbnail:string;
  attachments?:string[];
  comments: Comment[];
}
