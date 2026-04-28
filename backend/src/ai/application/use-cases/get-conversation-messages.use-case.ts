import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { GetMessagesDto, GetMessagesResponseDto } from '../dtos/get-messages.dto'

@Injectable()
export class GetConversationMessagesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: GetMessagesDto): Promise<GetMessagesResponseDto> {
    const limit = dto.limit ?? 50
    const offset = dto.offset ?? 0

    // Busca mensagens da conversa com paginação
    const [mensagens, total] = await Promise.all([
      this.prisma.mensagem.findMany({
        where: {
          conversaId: dto.conversaId,
        },
        select: {
          id: true,
          conteudo: true,
          role: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      this.prisma.mensagem.count({
        where: {
          conversaId: dto.conversaId,
        },
      }),
    ])

    // Reverter ordem para chronológica (mais antigo primeiro)
    mensagens.reverse()

    return {
      data: mensagens.map((msg) => ({
        id: msg.id,
        conteudo: msg.conteudo,
        role: msg.role as 'user' | 'assistant',
        createdAt: msg.createdAt.toISOString(),
      })),
      total,
      hasMore: offset + limit < total,
    }
  }
}
