/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
 type IUsersRepository,
  USERS_REPOSITORY_TOKEN,
  UserDomain,
} from '../../domain/ports/users-repository.port';
import {
  type IEmpresasRepository,
  EMPRESAS_REPOSITORY_TOKEN,
} from '../../domain/ports/empresas-repository.port';
import { RegisterDto } from '../dtos/register.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: IUsersRepository,
    @Inject(EMPRESAS_REPOSITORY_TOKEN)
    private readonly empresasRepository: IEmpresasRepository,
  ) {}

  async execute(
    dto: RegisterDto,
  ): Promise<Omit<UserDomain, 'senhaHash'>> {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const empresa = await this.empresasRepository.create(dto.nomeEmpresa);
    const senhaHash = await bcrypt.hash(dto.senha, 10);

    const user = await this.usersRepository.create({
      nome: dto.nome,
      email: dto.email,
      senhaHash,
      empresaId: empresa.id,
    });

    const { senhaHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
