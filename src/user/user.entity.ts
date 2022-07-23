import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  uuid!: string;
  @Column()
  email!: string;
  @Column()
  user_name!: string;
  @Column()
  salt!: string;
  @Column()
  cert!: string;
}
