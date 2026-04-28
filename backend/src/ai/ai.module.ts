import { Module } from '@nestjs/common';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { GetConversationMessagesUseCase } from './application/use-cases/get-conversation-messages.use-case';
import { OpenAIProvider } from './infrastructure/openai/openai.provider';
import { MessageQueueService } from './infrastructure/services/message-queue.service';
import { AI_PROVIDER_TOKEN } from './domain/ports/ai-provider.port';
import { ConversasRepository } from './infrastructure/repositories/conversas.repository';
import { CONVERSAS_REPOSITORY_TOKEN } from './domain/ports/conversas-repository.port';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    SendMessageUseCase,
    GetConversationMessagesUseCase,
    MessageQueueService,
    {
      provide: AI_PROVIDER_TOKEN,
      useClass: OpenAIProvider,
    },
    {
      provide: CONVERSAS_REPOSITORY_TOKEN,
      useClass: ConversasRepository,
    },
  ],
})
export class AiModule {}
