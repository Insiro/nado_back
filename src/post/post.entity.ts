import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import User from '../user/user.entity';

@Entity('posts')
export default class PostEntity {
  @PrimaryGeneratedColumn()
  id!: string;
  @Column()
  content!: string;
  @ManyToOne(() => User, (user: User | null) => user?.uuid, { cascade: false })
  author!: User | null;
}
