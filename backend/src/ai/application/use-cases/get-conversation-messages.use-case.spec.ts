import { Test, TestingModule } from '@nestjs/testing'
import { GetConversationMessagesUseCase } from './get-conversation-messages.use-case'
import { PrismaService } from '@/prisma/prisma.service'
import { GetMessagesDto } from '../dtos/get-messages.dto'

describe('GetConversationMessagesUseCase', () => {
  let useCase: GetConversationMessagesUseCase
  let prismaService: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetConversationMessagesUseCase,
        {
          provide: PrismaService,
          useValue: {
            mensagem: {
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile()

    useCase = module.get<GetConversationMessagesUseCase>(GetConversationMessagesUseCase)
    prismaService = module.get<PrismaService>(PrismaService)
  })

  it('should return messages with pagination', async () => {
    const conversaId = 'conv-123'
    // Ordem invertida pois Prisma retorna DESC, depois o use case faz reverse()
    const mockMessages = [
      {
        id: 'msg-2',
        conteudo: 'Oi, como posso ajudar?',
        role: 'assistant',
        createdAt: new Date('2026-04-27T10:00:05Z'),
      },
      {
        id: 'msg-1',
        conteudo: 'Olá',
        role: 'user',
        createdAt: new Date('2026-04-27T10:00:00Z'),
      },
    ]

    jest.spyOn(prismaService.mensagem, 'findMany').mockResolvedValue(mockMessages)
    jest.spyOn(prismaService.mensagem, 'count').mockResolvedValue(2)

    const dto = new GetMessagesDto()
    dto.conversaId = conversaId
    dto.limit = 50
    dto.offset = 0

    const result = await useCase.execute(dto)

    expect(result.data).toHaveLength(2)
    expect(result.total).toBe(2)
    expect(result.hasMore).toBe(false)
    expect(result.data[0].conteudo).toBe('Olá')
    expect(result.data[1].conteudo).toBe('Oi, como posso ajudar?')
  })

  it('should return correct pagination metadata', async () => {
    const conversaId = 'conv-123'
    const mockMessages = Array(25)
      .fill(null)
      .map((_, i) => ({
        id: `msg-${24 - i}`,
        conteudo: `Message ${24 - i}`,
        role: (24 - i) % 2 === 0 ? 'user' : 'assistant',
        createdAt: new Date(new Date('2026-04-27T10:00:00Z').getTime() + (24 - i) * 1000),
      }))

    jest.spyOn(prismaService.mensagem, 'findMany').mockResolvedValue(mockMessages)
    jest.spyOn(prismaService.mensagem, 'count').mockResolvedValue(75)

    const dto = new GetMessagesDto()
    dto.conversaId = conversaId
    dto.limit = 25
    dto.offset = 0

    const result = await useCase.execute(dto)

    expect(result.data).toHaveLength(25)
    expect(result.total).toBe(75)
    expect(result.hasMore).toBe(true)
  })

  it('should use default limit when not provided', async () => {
    const dto = new GetMessagesDto()
    dto.conversaId = 'conv-123'

    jest.spyOn(prismaService.mensagem, 'findMany').mockResolvedValue([])
    jest.spyOn(prismaService.mensagem, 'count').mockResolvedValue(0)

    await useCase.execute(dto)

    expect(prismaService.mensagem.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 50,
        skip: 0,
      }),
    )
  })
})
