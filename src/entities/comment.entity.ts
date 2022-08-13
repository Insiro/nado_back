import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from './user.entity';
import Posts from './post.entity';

@Entity('comment')
export default class Comment {
  @PrimaryGeneratedColumn()
  id!: string;
  @Column()
  content!: string;
  @ManyToOne(() => User, (user: User | null) => user?.uid, { cascade: false })
  author!: User | null;
  @ManyToOne(() => Posts, (post: Posts) => post.id, { cascade: true })
  post!: Posts;
  @ManyToOne(() => Comment, (comment: Comment | null) => comment.id, {
    cascade: false,
  })
  parent!: Comment | null;
}