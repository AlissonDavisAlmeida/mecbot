/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { OpenAIProvider } from './openai.provider';
import { Message } from '../../domain/value-objects/message.vo';

jest.mock('openai');

describe('OpenAIProvider', () => {
  let provider: OpenAIProvider;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const OpenAI = require('openai').default;
    mockCreate = jest.fn();
    OpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));

    provider = new OpenAIProvider();
  });

  it('should return the AI response content', async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'Olá, posso ajudar!' } }],
    });

    const messages = [new Message('user', 'Preciso de ajuda')];
    const result = await provider.generateResponse(messages);

    expect(result).toBe('Olá, posso ajudar!');
  });

  it('should throw when no content is returned', async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: null } }],
    });

    const messages = [new Message('user', 'Teste')];

    await expect(provider.generateResponse(messages)).rejects.toThrow(
      'No response received from AI provider',
    );
  });

  it('should map messages to the correct OpenAI format', async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'OK' } }],
    });

    const messages = [
      new Message('system', 'Você é um assistente'),
      new Message('user', 'Olá'),
    ];

    await provider.generateResponse(messages);

    expect(mockCreate).toHaveBeenCalledWith({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Você é um assistente' },
        { role: 'user', content: 'Olá' },
      ],
    });
  });

  it('should use gpt-4o-mini model', async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: 'Resposta' } }],
    });

    await provider.generateResponse([new Message('user', 'Teste')]);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gpt-4o-mini' }),
    );
  });
});
