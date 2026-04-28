import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Conversation } from '../../domain/entities/conversation.entity';
import { Message } from '../../domain/value-objects/message.vo';
import {
  IConversasRepository,
  ConversationMessagesPage,
} from '../../domain/ports/conversas-repository.port';

@Injectable()
export class ConversasRepository implements IConversasRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getOrCreateConversation(
        empresaId: string,
        cliente: string,
    ): Promise<Conversation> {

        // Busca apenas conversa ABERTA — conversa fechada é ignorada (novo atendimento)
        let conversa = await this.prisma.conversa.findFirst({
            where: {
                empresaId,
                cliente,
            },
            include: {
                mensagens: {
                    orderBy: {
                        createdAt: 'asc',
                    },
                    take: 10,
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
        } else {

            if (conversa.status === 'closed') {

                await this.prisma.conversa.update({
                    where: { id: conversa.id },
                    data: {
                        status: 'open', // reabre conversa existente (ex: se estava "closed")
                        updatedAt: new Date(), // atualiza timestamp para refletir reabertura
                    }
                })
            }
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

    async findMessagesByConversation(
        conversaId: string,
        empresaId: string,
        cliente: string,
        limit: number,
        offset: number,
    ): Promise<ConversationMessagesPage> {
        // Filtra pelo relacionamento para garantir isolamento multitenant no nível do banco
        const where = {
            conversaId,
            conversa: { empresaId, cliente },
        };

        const [mensagens, total] = await Promise.all([
            this.prisma.mensagem.findMany({
                where,
                select: { id: true, conteudo: true, role: true, createdAt: true },
                orderBy: { createdAt: 'asc' },
                take: limit,
                skip: offset,
            }),
            this.prisma.mensagem.count({ where }),
        ]);
        console.log("🚀 ~ ConversasRepository ~ findMessagesByConversation ~ mensagens:", mensagens)

        return {
            messages: mensagens.map((m) => ({
                id: m.id,
                conteudo: m.conteudo,
                role: m.role as 'user' | 'assistant',
                createdAt: m.createdAt,
            })),
            total,
        };
    }
}
