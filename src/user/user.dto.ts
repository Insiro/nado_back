import User from '../entities/user.entity';

export type SimpleUserInfoDto = Required<
  Readonly<Pick<User, 'uid' | 'user_name' | 'email'>>
>;

export type DetailedUserInfoDto = SimpleUserInfoDto;

export type RegisterUserInfoDto = Omit<User, 'cert' | 'salt'> & {
  readonly pwd: string;
};

export type EditableUserInfoDto = Omit<RegisterUserInfoDto, 'uid'> & {
  readonly pwd: string;
};

export type SignDto = Required<Readonly<Pick<User, 'uid'>>> & {
  readonly pwd: string;
};

export type SimpleUserDto = Required<Readonly<Pick<User, 'uid' | 'user_name'>>>;
