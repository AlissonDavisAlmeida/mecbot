export const EMPRESAS_REPOSITORY_TOKEN = Symbol('EMPRESAS_REPOSITORY');

export interface EmpresaDomain {
  id: string;
  nome: string;
  createdAt: Date;
}

export interface IEmpresasRepository {
  create(nome: string): Promise<EmpresaDomain>;
}
