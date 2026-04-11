import { Module } from '@nestjs/common';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { OpenAIProvider } from './infrastructure/openai/openai.provider';
import { AI_PROVIDER_TOKEN } from './domain/ports/ai-provider.port';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    SendMessageUseCase,
    {
      provide: AI_PROVIDER_TOKEN,
      useClass: OpenAIProvider,
    },
  ],
})
export class AiModule {}
