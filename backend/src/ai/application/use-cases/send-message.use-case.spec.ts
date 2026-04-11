import { SendMessageUseCase } from './send-message.use-case';
import { IAIProvider } from '../../domain/ports/ai-provider.port';
import { IConversasRepository } from '../../domain/ports/conversas-repository.port';
import { ChatRequestDto } from '../dtos/chat-request.dto';
import { Conversation } from '../../domain/entities/conversation.entity';
import { Message } from '../../domain/value-objects/message.vo';

describe('SendMessageUseCase', () => {
  let useCase: SendMessageUseCase;
  let mockAIProvider: jest.Mocked<IAIProvider>;
  let mockConversasRepository: jest.Mocked<IConversasRepository>;

  beforeEach(() => {
    mockAIProvider = {
      generateResponse: jest
        .fn()
        .mockResolvedValue('Olá! Como posso ajudar com sua oficina?'),
    };

    mockConversasRepository = {
      getOrCreateConversation: jest.fn(),
      addMessage: jest.fn(),
      getLastMessages: jest.fn(),
      loadConversation: jest.fn(),
      closeConversation: jest.fn(),
    };

    useCase = new SendMessageUseCase(mockAIProvider, mockConversasRepository);
  });

  it('should create conversation, save messages and return response', async () => {
    const conversation = new Conversation('conv-1', 'empresa-1', 'cliente-1');
    mockConversasRepository.getOrCreateConversation.mockResolvedValue(
      conversation,
    );
    mockConversasRepository.getLastMessages.mockResolvedValue([]);

    const dto: ChatRequestDto = {
      empresaId: 'empresa-1',
      cliente: 'cliente-1',
      message: 'Preciso de um orçamento',
    };

    const result = await useCase.execute(dto);

    expect(mockConversasRepository.getOrCreateConversation).toHaveBeenCalledWith(
      'empresa-1',
      'cliente-1',
    );
    expect(mockConversasRepository.addMessage).toHaveBeenCalledTimes(2); // user + assistant
    expect(result.response).toBe('Olá! Como posso ajudar com sua oficina?');
  });

  it('should fetch last messages from repository for context', async () => {
    const conversation = new Conversation('conv-1', 'empresa-1', 'cliente-1');
    const lastMessages = [
      new Message('user', 'Olá'),
      new Message('assistant', 'Oi!'),
    ];

    mockConversasRepository.getOrCreateConversation.mockResolvedValue(
      conversation,
    );
    mockConversasRepository.getLastMessages.mockResolvedValue(lastMessages);

    const dto: ChatRequestDto = {
      empresaId: 'empresa-1',
      cliente: 'cliente-1',
      message: 'E agora?',
    };

    await useCase.execute(dto);

    expect(mockConversasRepository.getLastMessages).toHaveBeenCalledWith(
      'conv-1',
      10,
    );

    const aiCallMessages = mockAIProvider.generateResponse.mock.calls[0][0];
    // system + 2 last + current user = 4
    expect(aiCallMessages).toHaveLength(4);
    expect(aiCallMessages[0].role).toBe('system');
    expect(aiCallMessages[1].content).toBe('Olá');
    expect(aiCallMessages[2].content).toBe('Oi!');
    expect(aiCallMessages[3].content).toBe('E agora?');
  });

  it('should save both user and assistant messages', async () => {
    const conversation = new Conversation('conv-1', 'empresa-1', 'cliente-1');
    mockConversasRepository.getOrCreateConversation.mockResolvedValue(
      conversation,
    );
    mockConversasRepository.getLastMessages.mockResolvedValue([]);

    const dto: ChatRequestDto = {
      empresaId: 'empresa-1',
      cliente: 'cliente-1',
      message: 'Teste',
    };

    await useCase.execute(dto);

    const calls = mockConversasRepository.addMessage.mock.calls;
    expect(calls).toHaveLength(2);

    // First call: user message
    expect(calls[0][0]).toBe('conv-1');
    expect(calls[0][1].role).toBe('user');
    expect(calls[0][1].content).toBe('Teste');

    // Second call: assistant message
    expect(calls[1][0]).toBe('conv-1');
    expect(calls[1][1].role).toBe('assistant');
    expect(calls[1][1].content).toBe('Olá! Como posso ajudar com sua oficina?');
  });

  it('should return correct response DTO', async () => {
    const conversation = new Conversation('conv-1', 'empresa-1', 'cliente-1');
    mockConversasRepository.getOrCreateConversation.mockResolvedValue(
      conversation,
    );
    mockConversasRepository.getLastMessages.mockResolvedValue([]);

    const dto: ChatRequestDto = {
      empresaId: 'empresa-1',
      cliente: 'cliente-1',
      message: 'Teste',
    };

    const result = await useCase.execute(dto);

    expect(result.response).toBe('Olá! Como posso ajudar com sua oficina?');
    expect(result.empresaId).toBe('empresa-1');
    expect(result.cliente).toBe('cliente-1');
    expect(result.timestamp).toBeInstanceOf(Date);
  });
});
