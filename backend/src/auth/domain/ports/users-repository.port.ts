export const USERS_REPOSITORY_TOKEN = Symbol('USERS_REPOSITORY');

export interface UserDomain {
  id: string;
  nome: string;
  email: string;
  senhaHash: string | null;
  provider: string;
  role: string;
  empresaId: string;
}

export interface CreateUserData {
  nome: string;
  email: string;
  senhaHash: string;
  empresaId: string;
  provider?: string;
  role?: string;
}

export interface IUsersRepository {
  findByEmail(email: string): Promise<UserDomain | null>;
  create(data: CreateUserData): Promise<UserDomain>;
}
