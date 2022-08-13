import { Allow } from 'class-validator';
import Comment from '../entities/comment.entity';

export class EditableCommentDto {
  @Allow()
  readonly content: string;
}

export class CommentInfoDto extends EditableCommentDto {
  @Allow()
  author: string | null;
  @Allow()
  post: string;
  @Allow()
  parent: string | null;

  static fromComment(comment: Comment): CommentInfoDto {
    return {
      author: comment.author.uid,
      post: comment.post.id,
      parent: comment.parent.id,
      content: comment.content,
    };
  }
}
