import { Allow } from 'class-validator';
import Posts from '../entities/post.entity';

export class EditPostDto {
  @Allow()
  content!: string;
}

export class NewPostDto extends EditPostDto {
  @Allow()
  author!: string | null;
}

export class PostDto extends NewPostDto {
  @Allow()
  id: string;
  @Allow()
  parent: string;

  static fromPost(post: Posts): PostDto {
    return {
      id: post.id,
      parent: post.parent,
      author: post.author,
      content: post.content,
    };
  }
}
