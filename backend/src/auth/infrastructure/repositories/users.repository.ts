/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateUserData,
  IUsersRepository,
  UserDomain,
} from '../../domain/ports/users-repository.port';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserDomain | null> {
    const user = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      senhaHash: user.senha,
      provider: user.provider,
      role: user.role,
      empresaId: user.empresaId,
    };
  }

  async create(data: CreateUserData): Promise<UserDomain> {
    const user = await this.prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: data.senhaHash,
        empresaId: data.empresaId,
        provider: data.provider ?? 'local',
        role: data.role ?? 'user',
      },
    });

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      senhaHash: user.senha,
      provider: user.provider,
      role: user.role,
      empresaId: user.empresaId,
    };
  }
}
