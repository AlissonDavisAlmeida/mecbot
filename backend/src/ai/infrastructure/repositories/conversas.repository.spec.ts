import { ConversasRepository } from './conversas.repository';
import { Message } from '../../domain/value-objects/message.vo';

describe('ConversasRepository', () => {
  let repository: ConversasRepository;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      conversa: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      mensagem: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    repository = new ConversasRepository(mockPrisma);
  });

  describe('getOrCreateConversation', () => {
    it('should return existing open conversation if found', async () => {
      const mockConversa = {
        id: 'conv-1',
        empresaId: 'emp-1',
        cliente: 'cli-1',
        status: 'open',
        createdAt: new Date(),
        mensagens: [
          { id: 'msg-1', role: 'user', conteudo: 'Olá', createdAt: new Date(), conversaId: 'conv-1' },
        ],
      };

      mockPrisma.conversa.findFirst.mockResolvedValue(mockConversa);

      const result = await repository.getOrCreateConversation('emp-1', 'cli-1');

      expect(result.id).toBe('conv-1');
      expect(result.empresaId).toBe('emp-1');
      expect(result.cliente).toBe('cli-1');
      expect(result.status).toBe('open');
      expect(result.messageCount).toBe(1);
      expect(mockPrisma.conversa.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { empresaId: 'emp-1', cliente: 'cli-1' },
        }),
      );
      expect(mockPrisma.conversa.update).not.toHaveBeenCalled();
    });

    it('should create new open conversation when none exists', async () => {
      const newConversa = {
        id: 'conv-2',
        empresaId: 'emp-1',
        cliente: 'cli-2',
        status: 'open',
        createdAt: new Date(),
        mensagens: [],
      };

      mockPrisma.conversa.findFirst.mockResolvedValue(null);
      mockPrisma.conversa.create.mockResolvedValue(newConversa);

      const result = await repository.getOrCreateConversation('emp-1', 'cli-2');

      expect(mockPrisma.conversa.create).toHaveBeenCalledWith({
        data: {
          empresaId: 'emp-1',
          cliente: 'cli-2',
          status: 'open',
        },
        include: {
          mensagens: true,
        },
      });
      expect(result.id).toBe('conv-2');
      expect(result.status).toBe('open');
      expect(result.messageCount).toBe(0);
    });

    it('should reopen a closed conversation instead of creating a new one', async () => {
      const closedConversa = {
        id: 'conv-old',
        empresaId: 'emp-1',
        cliente: 'cli-1',
        status: 'closed',
        createdAt: new Date(),
        mensagens: [],
      };

      mockPrisma.conversa.findFirst.mockResolvedValue(closedConversa);
      mockPrisma.conversa.update.mockResolvedValue({});

      const result = await repository.getOrCreateConversation('emp-1', 'cli-1');

      expect(mockPrisma.conversa.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'conv-old' },
          data: expect.objectContaining({ status: 'open' }),
        }),
      );
      expect(mockPrisma.conversa.create).not.toHaveBeenCalled();
      expect(result.id).toBe('conv-old');
    });
  });

  describe('addMessage', () => {
    it('should add message to conversation', async () => {
      const message = new Message('user', 'Teste', new Date('2026-04-11'));
      mockPrisma.mensagem.create.mockResolvedValue({});

      await repository.addMessage('conv-1', message);

      expect(mockPrisma.mensagem.create).toHaveBeenCalledWith({
        data: {
          conversaId: 'conv-1',
          role: 'user',
          conteudo: 'Teste',
          createdAt: new Date('2026-04-11'),
        },
      });
    });
  });

  describe('getLastMessages', () => {
    it('should return last N messages in chronological order', async () => {
      const date1 = new Date('2026-04-11T10:00:00');
      const date2 = new Date('2026-04-11T10:05:00');
      const date3 = new Date('2026-04-11T10:10:00');

      mockPrisma.mensagem.findMany.mockResolvedValue([
        { role: 'user', conteudo: 'Terceira', createdAt: date3, conversaId: 'conv-1', id: 'msg-3' },
        { role: 'assistant', conteudo: 'Segunda', createdAt: date2, conversaId: 'conv-1', id: 'msg-2' },
        { role: 'user', conteudo: 'Primeira', createdAt: date1, conversaId: 'conv-1', id: 'msg-1' },
      ]);

      const result = await repository.getLastMessages('conv-1', 10);

      expect(result).toHaveLength(3);
      expect(result[0].content).toBe('Primeira');
      expect(result[1].content).toBe('Segunda');
      expect(result[2].content).toBe('Terceira');
    });

    it('should respect limit parameter', async () => {
      mockPrisma.mensagem.findMany.mockResolvedValue([]);

      await repository.getLastMessages('conv-1', 10);

      expect(mockPrisma.mensagem.findMany).toHaveBeenCalledWith({
        where: {
          conversaId: 'conv-1',
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      });
    });
  });

  describe('loadConversation', () => {
    it('should load conversation with all messages', async () => {
      const mockConversa = {
        id: 'conv-1',
        empresaId: 'emp-1',
        cliente: 'cli-1',
        status: 'open',
        createdAt: new Date(),
        mensagens: [
          { id: 'msg-1', role: 'user', conteudo: 'Olá', createdAt: new Date(), conversaId: 'conv-1' },
          { id: 'msg-2', role: 'assistant', conteudo: 'Oi', createdAt: new Date(), conversaId: 'conv-1' },
        ],
      };

      mockPrisma.conversa.findUnique.mockResolvedValue(mockConversa);

      const result = await repository.loadConversation('conv-1');

      expect(result).not.toBeNull();
      expect(result?.messageCount).toBe(2);
      expect(result?.status).toBe('open');
    });

    it('should return null if conversation not found', async () => {
      mockPrisma.conversa.findUnique.mockResolvedValue(null);

      const result = await repository.loadConversation('conv-999');

      expect(result).toBeNull();
    });
  });

  describe('closeConversation', () => {
    it('should update conversation status to closed', async () => {
      mockPrisma.conversa.update.mockResolvedValue({});

      await repository.closeConversation('conv-1');

      expect(mockPrisma.conversa.update).toHaveBeenCalledWith({
        where: { id: 'conv-1' },
        data: { status: 'closed' },
      });
    });
  });

  describe('findMessagesByConversation', () => {
    const conversaId = 'conv-1';
    const empresaId = 'emp-1';
    const cliente = 'cli-1';

    it('should return messages with total filtered by tenant', async () => {
      const mockMensagens = [
        { id: 'msg-1', conteudo: 'Olá', role: 'user', createdAt: new Date('2026-04-28T10:00:00Z') },
        { id: 'msg-2', conteudo: 'Como posso ajudar?', role: 'assistant', createdAt: new Date('2026-04-28T10:00:05Z') },
      ];

      mockPrisma.mensagem.findMany.mockResolvedValue(mockMensagens);
      mockPrisma.mensagem.count.mockResolvedValue(2);

      const result = await repository.findMessagesByConversation(conversaId, empresaId, cliente, 50, 0);

      expect(result.messages).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.messages[0].id).toBe('msg-1');
      expect(result.messages[0].conteudo).toBe('Olá');
      expect(result.messages[0].role).toBe('user');
    });

    it('should query with tenant filter on the conversa relation', async () => {
      mockPrisma.mensagem.findMany.mockResolvedValue([]);
      mockPrisma.mensagem.count.mockResolvedValue(0);

      await repository.findMessagesByConversation(conversaId, empresaId, cliente, 25, 0);

      const expectedWhere = {
        conversaId,
        conversa: { empresaId, cliente },
      };

      expect(mockPrisma.mensagem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expectedWhere,
          orderBy: { createdAt: 'asc' },
          take: 25,
          skip: 0,
        }),
      );
      expect(mockPrisma.mensagem.count).toHaveBeenCalledWith({ where: expectedWhere });
    });

    it('should return empty page when no messages found', async () => {
      mockPrisma.mensagem.findMany.mockResolvedValue([]);
      mockPrisma.mensagem.count.mockResolvedValue(0);

      const result = await repository.findMessagesByConversation(conversaId, empresaId, cliente, 50, 0);

      expect(result.messages).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });
});
