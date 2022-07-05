import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from '../user/user.entity';
import Post from '../post/post.entity';

@Entity('comment')
export default class Comment {
  @PrimaryGeneratedColumn()
  id!: string;
  @Column()
  content!: string;
  @ManyToOne(() => User, (user: User | null) => user?.uuid, { cascade: false })
  author!: User | null;
  @ManyToOne(() => Post, (post: Post) => post.id, { cascade: true })
  post!: Post;
  @ManyToOne(() => Comment, (comment: Comment | null) => comment.id, {
    cascade: false,
  })
  parent!: Comment | null;
}
