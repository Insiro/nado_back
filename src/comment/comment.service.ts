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
    const comment = await this.commentRepository.findOne({
      where: { id: id },
      loadRelationIds: true,
    });
    if (comment == null) throw new NotFoundException();
    return comment;
  }
  validateComment(comment: Comment, uid: string = null) {
    if (comment.content === null) throw new NotFoundException();
    if (uid !== null && comment.author !== uid)
      throw new UnauthorizedException();
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
      this.validateComment(parent);
      comment.parent = parent.id;
      comment.post = parent.post;
    } else if (option.post) {
      comment.post = option.post.id;
    } else throw new UnprocessableEntityException();

    try {
      await this.commentRepository.insert(comment);
    } catch (_) {
      throw new UnprocessableEntityException();
    }
  }

  async deleteComment(uid: string, commentId: string, forceDelete = false) {
    const comment = await this.getOne(commentId);
    if (comment.author !== null && comment.author !== uid)
      throw new UnauthorizedException();

    if (!forceDelete) {
      const sub_comments = await this.getSubComments(commentId);
      if (sub_comments.length === 0) forceDelete = true;
    }
    await this.delete(commentId, forceDelete);
  }
  private async delete(commentId: string, hard = false) {
    if (hard) {
      const result = await this.commentRepository.delete({ id: commentId });
      if (result.affected == 0) throw new UnprocessableEntityException();
      return;
    }
    this.commentRepository.update(commentId, {
      author: null,
      content: null,
    });
  }
  async updateComment(
    uid: string,
    commentId: string,
    commentOpt: EditableCommentDto,
  ) {
    const comment = await this.getOne(commentId);
    this.validateComment(comment, uid);
    try {
      await this.commentRepository.update(commentId, {
        content: commentOpt.content,
      });
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async getByPost(postId: string): Promise<Comment[]> {
    return await this.commentRepository
      .createQueryBuilder('c')
      .where('c.postId = :postId', { postId: postId })
      .setFindOptions({ loadRelationIds: true })
      .getMany();
  }

  async getByAuthor(uid: string): Promise<Comment[]> {
    return await this.commentRepository.find({
      where: { author: uid },
    });
  }
  async getSubComments(parentId: string): Promise<Comment[]> {
    const ret = await this.commentRepository
      .createQueryBuilder('c')
      .where('c.parentId =:pid', { pid: parentId })
      .getMany();
    return ret;
  }
}
