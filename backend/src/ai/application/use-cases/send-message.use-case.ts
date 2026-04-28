import { Inject, Injectable } from '@nestjs/common';

import { Message } from '../../domain/value-objects/message.vo';
import {
  AI_PROVIDER_TOKEN,
  type IAIProvider,
} from '../../domain/ports/ai-provider.port';
import {
  CONVERSAS_REPOSITORY_TOKEN,
  type IConversasRepository,
} from '../../domain/ports/conversas-repository.port';
import { ChatRequestDto } from '../dtos/chat-request.dto';
import { ChatResponseDto } from '../dtos/chat-response.dto';
import { WORKSHOP_SYSTEM_PROMPT } from '../constants/workshop-system-prompt';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(AI_PROVIDER_TOKEN)
    private readonly aiProvider: IAIProvider,
    @Inject(CONVERSAS_REPOSITORY_TOKEN)
    private readonly conversasRepository: IConversasRepository,
  ) {}

  async execute(dto: ChatRequestDto): Promise<ChatResponseDto> {
    // 1. Obter ou criar conversa aberta
    const conversation = await this.conversasRepository.getOrCreateConversation(
      dto.empresaId,
      dto.cliente,
    );

    // 2. Buscar histórico ANTES de salvar a mensagem atual (evita duplicação no contexto)
    const lastMessages = await this.conversasRepository.getLastMessages(
      conversation.id,
      10,
    );

    // 3. Salvar mensagem do usuário
    const userMessage = new Message('user', dto.message);
    await this.conversasRepository.addMessage(conversation.id, userMessage);

    // 4. Montar contexto: system + histórico + mensagem atual
    const allMessages = [
      new Message('system', WORKSHOP_SYSTEM_PROMPT),
      ...lastMessages,
      userMessage,
    ];

    // 5. Gerar resposta via AI
    const response = await this.aiProvider.generateResponse(allMessages);

    // 6. Salvar resposta da IA
    const assistantMessage = new Message('assistant', response);
    await this.conversasRepository.addMessage(
      conversation.id,
      assistantMessage,
    );
    return {
      response,
      cliente: dto.cliente,
      empresaId: dto.empresaId,
      timestamp: new Date(),
    };
  }
}
