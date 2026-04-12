export class RegisterDto {
  nome: string;
  email: string;
  senha: string;
  empresaId: string;

    constructor(
        nome: string,
        email: string,
        senha: string,
        empresaId: string,
    ){
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.empresaId = empresaId;
    }
}
