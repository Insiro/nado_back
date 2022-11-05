import { Allow } from 'class-validator';
import Posts from '../entities/post.entity';
import Comment from '../entities/comment.entity';

export class EditPostDto {
  @Allow()
  content!: string;
}

export class NewPostDto extends EditPostDto {
  @Allow()
  author!: string | null;
  @Allow()
  title!: string;
}

export class PostDto extends NewPostDto {
  @Allow()
  id: string;
  @Allow()
  parent: string | Posts;
  @Allow()
  comment: Comment[] | undefined;
  static fromPost(post: Posts): PostDto {
    return {
      id: post.id,
      parent: post.parent,
      author: post.author,
      content: post.content,
      comment: undefined,
      title: post.title,
    };
  }
}
