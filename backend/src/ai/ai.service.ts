import { Injectable } from '@nestjs/common';

import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { ChatRequestDto } from './application/dtos/chat-request.dto';
import { ChatResponseDto } from './application/dtos/chat-response.dto';

@Injectable()
export class AiService {
  constructor(private readonly sendMessageUseCase: SendMessageUseCase) {}

  sendMessage = async (dto: ChatRequestDto): Promise<ChatResponseDto> => {
    return this.sendMessageUseCase.execute(dto);
  }
}
