import { Test, TestingModule } from '@nestjs/testing'
import { GetConversationMessagesUseCase } from './get-conversation-messages.use-case'
import {
  CONVERSAS_REPOSITORY_TOKEN,
  IConversasRepository,
} from '../../domain/ports/conversas-repository.port'
import { GetMessagesDto } from '../dtos/get-messages.dto'

const MOCK_CONVERSA_ID = 'conv-123'
const MOCK_EMPRESA_ID = 'emp-1'
const MOCK_CLIENTE = 'cli-1'

describe('GetConversationMessagesUseCase', () => {
  let useCase: GetConversationMessagesUseCase
  let repository: jest.Mocked<IConversasRepository>

  beforeEach(async () => {
    repository = {
      findMessagesByConversation: jest.fn(),
    } as unknown as jest.Mocked<IConversasRepository>

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetConversationMessagesUseCase,
        { provide: CONVERSAS_REPOSITORY_TOKEN, useValue: repository },
      ],
    }).compile()

    useCase = module.get<GetConversationMessagesUseCase>(GetConversationMessagesUseCase)
  })

  function buildDto(overrides: Partial<GetMessagesDto> = {}): GetMessagesDto {
    const dto = new GetMessagesDto()
    dto.conversaId = MOCK_CONVERSA_ID
    dto.empresaId = MOCK_EMPRESA_ID
    dto.cliente = MOCK_CLIENTE
    dto.limit = 50
    dto.offset = 0
    return Object.assign(dto, overrides)
  }

  it('should return messages with pagination', async () => {
    const mockMessages = [
      { id: 'msg-1', conteudo: 'Olá', role: 'user' as const, createdAt: new Date('2026-04-27T10:00:00Z') },
      { id: 'msg-2', conteudo: 'Oi, como posso ajudar?', role: 'assistant' as const, createdAt: new Date('2026-04-27T10:00:05Z') },
    ]

    repository.findMessagesByConversation.mockResolvedValue({ messages: mockMessages, total: 2 })

    const result = await useCase.execute(buildDto())

    expect(result.data).toHaveLength(2)
    expect(result.total).toBe(2)
    expect(result.hasMore).toBe(false)
    expect(result.data[0].conteudo).toBe('Olá')
    expect(result.data[1].conteudo).toBe('Oi, como posso ajudar?')
  })

  it('should return correct pagination metadata when there are more pages', async () => {
    const mockMessages = Array(25)
      .fill(null)
      .map((_, i) => ({
        id: `msg-${i}`,
        conteudo: `Message ${i}`,
        role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
        createdAt: new Date(Date.now() + i * 1000),
      }))

    repository.findMessagesByConversation.mockResolvedValue({ messages: mockMessages, total: 75 })

    const result = await useCase.execute(buildDto({ limit: 25, offset: 0 }))

    expect(result.data).toHaveLength(25)
    expect(result.total).toBe(75)
    expect(result.hasMore).toBe(true)
  })

  it('should delegate to repository with correct tenant params', async () => {
    repository.findMessagesByConversation.mockResolvedValue({ messages: [], total: 0 })

    await useCase.execute(buildDto())

    expect(repository.findMessagesByConversation).toHaveBeenCalledWith(
      MOCK_CONVERSA_ID,
      MOCK_EMPRESA_ID,
      MOCK_CLIENTE,
      50,
      0,
    )
  })

  it('should use default limit and offset when not provided', async () => {
    repository.findMessagesByConversation.mockResolvedValue({ messages: [], total: 0 })

    const dto = new GetMessagesDto()
    dto.conversaId = MOCK_CONVERSA_ID
    dto.empresaId = MOCK_EMPRESA_ID
    dto.cliente = MOCK_CLIENTE

    await useCase.execute(dto)

    expect(repository.findMessagesByConversation).toHaveBeenCalledWith(
      MOCK_CONVERSA_ID,
      MOCK_EMPRESA_ID,
      MOCK_CLIENTE,
      50,
      0,
    )
  })
})
