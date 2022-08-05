import Posts from '../entities/post.entity';

export type NewPostDto = Readonly<Omit<Posts, 'id' | 'parent'>>;
