import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from './user.entity';
import Posts from './post.entity';

@Entity('comment')
export default class Comment {
  @PrimaryGeneratedColumn()
  id!: string;
  @Column({ nullable: true })
  content!: string | null;
  @ManyToOne(() => User, (user: User | null) => user?.uid, {
    onDelete: 'SET NULL',
  })
  author!: string | null;
  @ManyToOne(() => Posts, (post: Posts) => post.id, {
    onDelete: 'CASCADE',
  })
  post!: string;
  @ManyToOne(() => Comment, (comment: Comment | null) => comment.id, {
    onDelete: 'SET NULL',
  })
  parent!: string | null;
}
