import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export default class User {
  @PrimaryGeneratedColumn()
  uuid!: string;
  @Column()
  email!: string;
  @Column()
  userName!: string;
  @Column()
  salt!: string;
  @Column()
  cert!: string;
}
