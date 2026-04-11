import { Test, TestingModule } from '@nestjs/testing';
import { AiService } from './ai.service';
import { SendMessageUseCase } from './application/use-cases/send-message.use-case';
import { ChatRequestDto } from './application/dtos/chat-request.dto';
import { ChatResponseDto } from './application/dtos/chat-response.dto';

describe('AiService', () => {
  let service: AiService;
  let sendMessageUseCase: jest.Mocked<SendMessageUseCase>;

  const mockResponse: ChatResponseDto = {
    response: 'Resposta de teste',
    customerId: 'customer-1',
    workshopId: 'workshop-1',
    timestamp: new Date(),
  };

  beforeEach(async () => {
    sendMessageUseCase = {
      execute: jest.fn().mockResolvedValue(mockResponse),
    } as unknown as jest.Mocked<SendMessageUseCase>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: SendMessageUseCase, useValue: sendMessageUseCase },
      ],
    }).compile();

    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delegate sendMessage to SendMessageUseCase', async () => {
    const dto: ChatRequestDto = {
      customerId: 'customer-1',
      workshopId: 'workshop-1',
      message: 'Preciso de revisão',
    };

    const result = await service.sendMessage(dto);

    expect(sendMessageUseCase.execute).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockResponse);
  });
});
