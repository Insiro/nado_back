import User from './user.entity';

export type SimpleUserInfoDto = Required<
  Readonly<Pick<User, 'uuid' | 'user_name' | 'email'>>
>;

export type DetailedUserInfoDto = SimpleUserInfoDto;

export type EditableUserInfoDto = Omit<User, 'uuid' | 'cert' | 'salt'> & {
  readonly pwd: string;
};

export type SignDto = Required<Readonly<Pick<User, 'uuid'>>> & {
  readonly pwd: string;
};

export type SimpleUserDto = Required<
  Readonly<Pick<User, 'uuid' | 'user_name'>>
>;
