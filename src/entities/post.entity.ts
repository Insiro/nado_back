import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from './user.entity';

@Entity('posts')
export default class Posts {
  @PrimaryGeneratedColumn()
  id!: string;
  @Column()
  content!: string;
  @ManyToOne(() => User, (user: User | null) => user?.uid, { cascade: false })
  author!: User | null;
  @ManyToOne(() => Posts, (post: Posts | null) => post?.id)
  parent!: Posts | null;
}
