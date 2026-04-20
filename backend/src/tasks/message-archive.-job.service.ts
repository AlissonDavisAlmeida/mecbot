/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MessageArchiveJob {
  private readonly logger = new Logger(MessageArchiveJob.name);

  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async archiveOldMessages() {
    const limite = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 dias

    // 1. buscar mensagens antigas
    const mensagens = await this.prisma.mensagem.findMany({
      where: {
        createdAt: { lt: limite },
      },
      take: 1000, // processa em batch
    });

    if (!mensagens.length) return;

    // 2. copiar pro archive
    await this.prisma.mensagemArquivada.createMany({
      data: mensagens.map((m) => ({
        id: m.id,
        conversaId: m.conversaId,
        conteudo: m.conteudo,
        role: m.role,
        createdAt: m.createdAt,
      })),
      skipDuplicates: true,
    });

    // 3. deletar da tabela principal
    await this.prisma.mensagem.deleteMany({
      where: {
        id: {
          in: mensagens.map((m) => m.id),
        },
      },
    });

    this.logger.log(`Arquivadas ${mensagens.length} mensagens`);
  }
}