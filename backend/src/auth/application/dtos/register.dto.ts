export class RegisterDto {
  nome: string;
  email: string;
  senha: string;
  nomeEmpresa: string;

  constructor(
    nome: string,
    email: string,
    senha: string,
    nomeEmpresa: string,
  ) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.nomeEmpresa = nomeEmpresa;
  }
}
