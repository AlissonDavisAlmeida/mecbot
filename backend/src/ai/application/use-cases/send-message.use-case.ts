import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { Conversation } from '../../domain/entities/conversation.entity';
import { Message, MessageRole } from '../../domain/value-objects/message.vo';
import {
  AI_PROVIDER_TOKEN,
 type IAIProvider,
} from '../../domain/ports/ai-provider.port';
import { ChatRequestDto } from '../dtos/chat-request.dto';
import { ChatResponseDto } from '../dtos/chat-response.dto';
import { WORKSHOP_SYSTEM_PROMPT } from '../constants/workshop-system-prompt';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(AI_PROVIDER_TOKEN)
    private readonly aiProvider: IAIProvider,
  ) {}

  async execute(dto: ChatRequestDto): Promise<ChatResponseDto> {
    const historyMessages = (dto.conversationHistory ?? []).map(
      (m) => new Message(m.role as MessageRole, m.content),
    );

    const conversation = new Conversation(
      randomUUID(),
      dto.workshopId,
      dto.customerId,
      historyMessages,
    );

    const userMessage = new Message('user', dto.message);
    conversation.addMessage(userMessage);

    const allMessages = [
      new Message('system', WORKSHOP_SYSTEM_PROMPT),
      ...historyMessages,
      userMessage,
    ];

    const response = await this.aiProvider.generateResponse(allMessages);

    return {
      response,
      customerId: dto.customerId,
      workshopId: dto.workshopId,
      timestamp: new Date(),
    };
  }
}
