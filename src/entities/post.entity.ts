import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from './user.entity';

@Entity('posts')
export default class Posts {
  @PrimaryGeneratedColumn()
  id!: string;
  @Column()
  title!: string;
  @Column({ nullable: true })
  content!: string | null;
  @ManyToOne(() => User, (user: User | null) => user?.uid, {
    onDelete: 'SET NULL',
  })
  author!: string | null;
  @ManyToOne(() => Posts, (post: Posts | null) => post?.id, {
    onDelete: 'CASCADE',
  })
  parent!: string | null;
}
