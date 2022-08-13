import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Comment from '../entities/comment.entity';
import User from '../entities/user.entity';
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
    user: User,
    commentOpt: EditableCommentDto,
    option: {
      parent?: string;
      post?: Posts;
    },
  ) {
    const comment: Omit<Comment, 'id'> = {
      author: user,
      parent: null,
      post: null,
      ...commentOpt,
    };
    if (option.parent) {
      comment.parent = await this.getOne(option.parent);
      comment.post = comment.parent.post;
    } else if (option.post) {
    } else throw new UnprocessableEntityException();

    try {
      await this.commentRepository.insert(comment);
    } catch (_) {
      throw new UnprocessableEntityException();
    }
  }

  async deleteComment(user: User, commentId: string) {
    const comment = await this.getOne(commentId);
    if (user.uid !== comment.author.uid) throw new UnauthorizedException();
    try {
      await this.commentRepository.delete(comment);
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async updateComment(
    user: User,
    commentId: string,
    commentOpt: EditableCommentDto,
  ) {
    const comment = await this.getOne(commentId);
    if (user.uid !== comment.author.uid) throw new UnauthorizedException();
    try {
      comment.content = commentOpt.content;
      await this.commentRepository.save(comment);
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async getByPosts(post: Posts): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { post: post },
    });
  }

  async getByAuthor(user: User): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { author: user },
    });
  }
}
