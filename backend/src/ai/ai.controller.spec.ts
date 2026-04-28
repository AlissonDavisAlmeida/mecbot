import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { GetConversationMessagesUseCase } from './application/use-cases/get-conversation-messages.use-case';
import { ChatRequestDto } from './application/dtos/chat-request.dto';
import { ChatResponseDto } from './application/dtos/chat-response.dto';

describe('AiController', () => {
  let controller: AiController;
  let aiService: jest.Mocked<AiService>;
  let getMessagesUseCase: jest.Mocked<GetConversationMessagesUseCase>;

  const mockResponse: ChatResponseDto = {
    response: 'Olá! Como posso ajudar?',
    cliente: 'cliente-1',
    empresaId: 'empresa-1',
    timestamp: new Date(),
  };

  beforeEach(async () => {
    aiService = {
      sendMessage: jest.fn().mockResolvedValue(mockResponse),
    } as unknown as jest.Mocked<AiService>;

    getMessagesUseCase = {
      execute: jest.fn().mockResolvedValue({
        data: [],
        total: 0,
        hasMore: false,
      }),
    } as unknown as jest.Mocked<GetConversationMessagesUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        { provide: AiService, useValue: aiService },
        { provide: GetConversationMessagesUseCase, useValue: getMessagesUseCase },
      ],
    }).compile();

    controller = module.get<AiController>(AiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call aiService.sendMessage and return the response', async () => {
    const dto: ChatRequestDto = {
      cliente: 'cliente-1',
      empresaId: 'empresa-1',
      message: 'Quero um orçamento',
    };

    const result = await controller.chat(dto);

    expect(aiService.sendMessage).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResponse);
  });

  it('should call getMessagesUseCase.execute and return messages', async () => {
    const result = await controller.getMessages('conv-123', 'emp-1', 'cli-1', '50', '0');

    expect(getMessagesUseCase.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        conversaId: 'conv-123',
        empresaId: 'emp-1',
        cliente: 'cli-1',
        limit: 50,
        offset: 0,
      }),
    );
    expect(result).toEqual({
      data: [],
      total: 0,
      hasMore: false,
    });
  });
});
