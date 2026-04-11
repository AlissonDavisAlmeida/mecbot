import { SendMessageUseCase } from './send-message.use-case';
import { IAIProvider } from '../../domain/ports/ai-provider.port';
import { ChatRequestDto } from '../dtos/chat-request.dto';

describe('SendMessageUseCase', () => {
  let useCase: SendMessageUseCase;
  let mockAIProvider: jest.Mocked<IAIProvider>;

  beforeEach(() => {
    mockAIProvider = {
      generateResponse: jest
        .fn()
        .mockResolvedValue('Olá! Como posso ajudar com sua oficina?'),
    };

    useCase = new SendMessageUseCase(mockAIProvider);
  });

  it('should return a chat response with all fields', async () => {
    const dto: ChatRequestDto = {
      customerId: 'customer-1',
      workshopId: 'workshop-1',
      message: 'Preciso de um orçamento para revisão',
    };

    const result = await useCase.execute(dto);

    expect(result.response).toBe('Olá! Como posso ajudar com sua oficina?');
    expect(result.customerId).toBe('customer-1');
    expect(result.workshopId).toBe('workshop-1');
    expect(result.timestamp).toBeInstanceOf(Date);
  });

  it('should include system prompt as first message', async () => {
    const dto: ChatRequestDto = {
      customerId: 'c',
      workshopId: 'w',
      message: 'Oi',
    };

    await useCase.execute(dto);

    const calledMessages = mockAIProvider.generateResponse.mock.calls[0][0];
    expect(calledMessages[0].role).toBe('system');
    expect(calledMessages[0].content).toContain('MecBot');
  });

  it('should include conversation history and user message in call', async () => {
    const dto: ChatRequestDto = {
      customerId: 'c',
      workshopId: 'w',
      message: 'Qual o preço?',
      conversationHistory: [
        { role: 'user', content: 'Preciso trocar o óleo' },
        { role: 'assistant', content: 'Claro! Qual é o modelo do carro?' },
      ],
    };

    await useCase.execute(dto);

    const calledMessages = mockAIProvider.generateResponse.mock.calls[0][0];
    // system + 2 history + 1 user = 4
    expect(calledMessages).toHaveLength(4);
    expect(calledMessages[1].content).toBe('Preciso trocar o óleo');
    expect(calledMessages[2].content).toBe('Claro! Qual é o modelo do carro?');
    expect(calledMessages[3].content).toBe('Qual o preço?');
  });

  it('should work without conversationHistory', async () => {
    const dto: ChatRequestDto = {
      customerId: 'c',
      workshopId: 'w',
      message: 'Oi',
    };

    await useCase.execute(dto);

    const calledMessages = mockAIProvider.generateResponse.mock.calls[0][0];
    // system + user = 2
    expect(calledMessages).toHaveLength(2);
  });

  it('should throw when message is empty', async () => {
    const dto: ChatRequestDto = {
      customerId: 'c',
      workshopId: 'w',
      message: '',
    };

    await expect(useCase.execute(dto)).rejects.toThrow();
  });
});
