import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('users')
export default class User {
  @PrimaryColumn()
  uid!: string;
  @Column()
  email!: string;
  @Column()
  user_name!: string;
  @Column()
  salt!: string;
  @Column()
  cert!: string;
}
