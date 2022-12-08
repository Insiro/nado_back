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
  validPost(post: Posts, authorId: string = null): Posts {
    if (post.content === null) throw new NotFoundException();
    if (authorId !== null && post.author !== authorId)
      throw new UnauthorizedException();
    return post;
  }
  async getOne(postId: string, load_parent = false): Promise<Posts> {
    let post: any = await this.postRepository.findOne({
      where: { id: postId },
      loadRelationIds: true,
    });
    if (!post) throw new NotFoundException();

    if (load_parent && post.parent !== null) {
      const parent = await this.postRepository.findOne({
        where: { id: post.parent },
        loadEagerRelations: true,
      });
      post = { ...post, parent: parent };
    }
    return post;
  }

  async newPost(
    author: User,
    postOpt: NewPostDto,
    postId: string | null = null,
  ) {
    let parentId: string | null = null;
    if (postId) {
      const parent = await this.getOne(postId);
      this.validPost(parent);
      parentId = parent.id;
    }
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
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .where('post.parentId = :id', { id: postId })
      .setFindOptions({ loadRelationIds: true })
      .getMany();
    return posts;
  }

  async updatePost(user: User, postId: string, postOpt: EditPostDto) {
    const post = await this.getOne(postId);
    this.validPost(post, user.uid);
    try {
      await this.postRepository
        .createQueryBuilder()
        .update(post)
        .set({ ...postOpt })
        .where({ id: postId })
        .execute();
    } catch (e) {
      throw new UnprocessableEntityException();
    }
  }

  async deletePost(user: User, postId: string, forceDelete = false) {
    const post = await this.getOne(postId);
    if (post.author !== null && post.author != user.uid)
      throw new UnauthorizedException();
    if (!forceDelete) {
      const sub_posts = await this.getSubPosts(postId);
      if (sub_posts.length === 0) forceDelete = true;
    }
    await this.delete(postId, forceDelete);
  }

  private async delete(postId: string, hard = false) {
    if (hard) {
      const result = await this.postRepository.delete({ id: postId });
      if (result.affected == 0) throw new UnprocessableEntityException();
      return;
    }
    await this.postRepository.update(postId, {
      content: null,
      title: '',
      author: null,
    });
  }

  async getByAuthor(uid: string): Promise<Posts[]> {
    return await this.postRepository.find({ where: { author: uid } });
  }
}
