export interface AuthUserResponse {
  id: string;
  nome: string;
  email: string;
  role: string;
  empresaId: string;
}

export class AuthResponseDto {
  access_token: string;
  user: AuthUserResponse;
}
