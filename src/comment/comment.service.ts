import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Comment from '../entities/comment.entity';
import Posts from '../entities/post.entity';

import { EditableCommentDto } from './comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async getOne(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id: id } });
    if (comment == null) throw new NotFoundException();
    return comment;
  }

  async addComment(
    uid: string,
    commentOpt: EditableCommentDto,
    option: {
      parent?: string;
      post?: Posts;
    },
  ) {
    const comment: Omit<Comment, 'id'> = {
      author: uid,
      parent: null,
      post: null,
      ...commentOpt,
    };
    if (option.parent) {
      const parent = await this.getOne(option.parent);
      comment.parent = parent.id;
      comment.post = parent.post;
    } else if (option.post) {
    } else throw new UnprocessableEntityException();

    try {
      await this.commentRepository.insert(comment);
    } catch (_) {
      throw new UnprocessableEntityException();
    }
  }

  async deleteComment(uid: string, commentId: string) {
    const comment = await this.getOne(commentId);
    if (uid !== comment.author) throw new UnauthorizedException();
    try {
      await this.commentRepository.delete(comment);
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async updateComment(
    uid: string,
    commentId: string,
    commentOpt: EditableCommentDto,
  ) {
    const comment = await this.getOne(commentId);
    if (uid !== comment.author) throw new UnauthorizedException();
    try {
      comment.content = commentOpt.content;
      await this.commentRepository.save(comment);
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async getByPost(postId: string): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { post: postId },
    });
  }

  async getByAuthor(uid: string): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { author: uid },
    });
  }
}
