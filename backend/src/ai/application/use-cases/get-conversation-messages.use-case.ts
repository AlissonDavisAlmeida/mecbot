import { Inject, Injectable } from '@nestjs/common'
import {
  CONVERSAS_REPOSITORY_TOKEN,
  type IConversasRepository,
} from '../../domain/ports/conversas-repository.port'
import { GetMessagesDto, GetMessagesResponseDto } from '../dtos/get-messages.dto'

@Injectable()
export class GetConversationMessagesUseCase {
  constructor(
    @Inject(CONVERSAS_REPOSITORY_TOKEN)
    private readonly conversasRepository: IConversasRepository,
  ) {}

  async execute(dto: GetMessagesDto): Promise<GetMessagesResponseDto> {
    const limit = dto.limit ?? 50
    const offset = dto.offset ?? 0

    const { messages, total } = await this.conversasRepository.findMessagesByConversation(
      dto.conversaId,
      dto.empresaId,
      dto.cliente,
      limit,
      offset,
    )

    return {
      data: messages.map((msg) => ({
        id: msg.id,
        conteudo: msg.conteudo,
        role: msg.role,
        createdAt: msg.createdAt.toISOString(),
      })),
      total,
      hasMore: offset + limit < total,
    }
  }
}
