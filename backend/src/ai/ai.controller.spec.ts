import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ChatRequestDto } from './application/dtos/chat-request.dto';
import { ChatResponseDto } from './application/dtos/chat-response.dto';

describe('AiController', () => {
  let controller: AiController;
  let aiService: jest.Mocked<AiService>;

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

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [{ provide: AiService, useValue: aiService }],
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
});
