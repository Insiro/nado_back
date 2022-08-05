import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NewPostDto } from './post.dto';

import Posts from '../entities/post.entity';
import User from '../entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts) private postRepository: Repository<Posts>,
  ) {}

  async getPosts(
    offset: number,
    count: null | number = null,
  ): Promise<Posts[]> {
    const query = this.postRepository
      .createQueryBuilder()
      .select()
      .offset(offset);
    if (count) query.limit(count);
    return await query.execute();
  }

  async getOne(postId: string): Promise<Posts> {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException();
    return post;
  }

  async newPost(
    author: User,
    postOpt: NewPostDto,
    postId: string | null = null,
  ) {
    const parent = await this.getOne(postId);
    try {
      await this.postRepository
        .createQueryBuilder()
        .insert()
        .into(Posts)
        .values({ ...postOpt, parent: parent, author: author })
        .execute();
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async getSubPosts(postId: string): Promise<Posts[]> {
    const post = await this.getOne(postId);
    return await this.postRepository.findBy({ parent: post });
  }

  async updatePost(user: User, postId: string, postOpt: NewPostDto) {
    const post = await this.getOne(postId);
    if (post.author.uid !== user.uid) throw new UnauthorizedException();
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
    if (post.author.uid != user.uid) throw new UnauthorizedException();
    await this.postRepository.delete(post);
  }
}
