import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EditPostDto, NewPostDto } from './post.dto';

import Posts from '../entities/post.entity';
import User from '../entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts) private postRepository: Repository<Posts>,
  ) {}

  async getPosts(offset = 0, count = 100): Promise<Posts[]> {
    const posts = this.postRepository.find({
      take: count,
      skip: offset,
      loadRelationIds: true,
    });

    return await posts;
  }

  async getOne(postId: string): Promise<Posts> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      loadRelationIds: true,
    });
    if (!post) throw new NotFoundException();
    return post;
  }

  async newPost(
    author: User,
    postOpt: NewPostDto,
    postId: string | null = null,
  ) {
    const parentId = postId ? (await this.getOne(postId)).id : null;
    try {
      await this.postRepository
        .createQueryBuilder()
        .insert()
        .into(Posts)
        .values({ ...postOpt, parent: parentId, author: author.uid })
        .execute();
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async getSubPosts(postId: string): Promise<Posts[]> {
    return await this.postRepository.findBy({ parent: postId });
  }

  async updatePost(user: User, postId: string, postOpt: EditPostDto) {
    const post = await this.getOne(postId);
    if (post.author !== user.uid) throw new UnauthorizedException();
    try {
      await this.postRepository
        .createQueryBuilder()
        .update(post)
        .set({ ...postOpt })
        .execute();
    } catch (_) {
      throw new UnprocessableEntityException();
    }
  }

  async deletePost(user: User, postId: string) {
    const post = await this.getOne(postId);
    if (post.author != user.uid) throw new UnauthorizedException();
    await this.postRepository.delete(post);
  }

  async getByAuthor(uid: string): Promise<Posts[]> {
    return await this.postRepository.find({ where: { author: uid } });
  }
}
