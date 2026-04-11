import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Conversation } from '../../domain/entities/conversation.entity';
import { Message } from '../../domain/value-objects/message.vo';
import { IConversasRepository } from '../../domain/ports/conversas-repository.port';

@Injectable()
export class ConversasRepository implements IConversasRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateConversation(
    empresaId: string,
    cliente: string,
  ): Promise<Conversation> {
    // Busca apenas conversa com status "open" para este cliente nesta empresa
    let conversa = await this.prisma.conversa.findFirst({
      where: {
        empresaId,
        cliente,
        status: 'open',
      },
      include: {
        mensagens: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    // Se não existe conversa aberta, cria nova
    if (!conversa) {
      conversa = await this.prisma.conversa.create({
        data: {
          empresaId,
          cliente,
          status: 'open',
        },
        include: {
          mensagens: true,
        },
      });
    }

    return Conversation.fromPersistence({
      id: conversa.id,
      empresaId: conversa.empresaId,
      cliente: conversa.cliente,
      status: conversa.status as string,
      mensagens: conversa.mensagens.map((m) => ({
        role: m.role,
        conteudo: m.conteudo,
        createdAt: m.createdAt,
      })),
    });
  }

  async addMessage(conversaId: string, message: Message): Promise<void> {
    const persistence = message.toPersistence();
    await this.prisma.mensagem.create({
      data: {
        conversaId,
        role: persistence.role,
        conteudo: persistence.conteudo,
        createdAt: persistence.createdAt,
      },
    });
  }

  async getLastMessages(conversaId: string, limit: number): Promise<Message[]> {
    const mensagens = await this.prisma.mensagem.findMany({
      where: {
        conversaId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    // Inverte para ordem cronológica (antiga para nova)
    return mensagens
      .reverse()
      .map((m) =>
        Message.fromPersistence({
          role: m.role,
          conteudo: m.conteudo,
          createdAt: m.createdAt,
        }),
      );
  }

  async loadConversation(conversaId: string): Promise<Conversation | null> {
    const conversa = await this.prisma.conversa.findUnique({
      where: {
        id: conversaId,
      },
      include: {
        mensagens: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!conversa) {
      return null;
    }

    return Conversation.fromPersistence({
      id: conversa.id,
      empresaId: conversa.empresaId,
      cliente: conversa.cliente,
      status: conversa.status as string,
      mensagens: conversa.mensagens.map((m) => ({
        role: m.role,
        conteudo: m.conteudo,
        createdAt: m.createdAt,
      })),
    });
  }

  async closeConversation(conversaId: string): Promise<void> {
    await this.prisma.conversa.update({
      where: { id: conversaId },
      data: { status: 'closed' },
    });
  }
}
