export interface AuthUserResponse {
  id: string;
  nome: string;
  email: string;
  role: string;
  empresaId: string;
}

export interface AuthResponseDto {
  access_token: string;
  user: AuthUserResponse;
}
