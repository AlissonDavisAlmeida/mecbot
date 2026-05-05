import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  EmpresaDomain,
  IEmpresasRepository,
} from '../../domain/ports/empresas-repository.port';

@Injectable()
export class EmpresasRepository implements IEmpresasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(nome: string): Promise<EmpresaDomain> {
    const empresa = await this.prisma.empresa.create({
      data: { nome },
    });

    return {
      id: empresa.id,
      nome: empresa.nome,
      createdAt: empresa.createdAt,
    };
  }
}
