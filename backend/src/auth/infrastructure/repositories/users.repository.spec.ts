import { UsersRepository } from './users.repository';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let mockPrisma: any;

  const prismaUser = {
    id: 'user-1',
    nome: 'João Silva',
    email: 'joao@oficina.com',
    senha: 'hashed-password',
    provider: 'local',
    providerId: null,
    role: 'user',
    empresaId: 'emp-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockPrisma = {
      usuario: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    repository = new UsersRepository(mockPrisma);
  });

  describe('findByEmail', () => {
    it('should return mapped UserDomain when user exists', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(prismaUser);

      const result = await repository.findByEmail('joao@oficina.com');

      expect(mockPrisma.usuario.findUnique).toHaveBeenCalledWith({
        where: { email: 'joao@oficina.com' },
      });
      expect(result).not.toBeNull();
      expect(result!.id).toBe('user-1');
      expect(result!.senhaHash).toBe('hashed-password');
      expect(result!.provider).toBe('local');
      expect(result!.role).toBe('user');
    });

    it('should return null when user not found', async () => {
      mockPrisma.usuario.findUnique.mockResolvedValue(null);

      const result = await repository.findByEmail('naoexiste@email.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create user and return mapped UserDomain', async () => {
      mockPrisma.usuario.create.mockResolvedValue(prismaUser);

      const result = await repository.create({
        nome: 'João Silva',
        email: 'joao@oficina.com',
        senhaHash: 'hashed-password',
        empresaId: 'emp-1',
      });

      expect(mockPrisma.usuario.create).toHaveBeenCalledWith({
        data: {
          nome: 'João Silva',
          email: 'joao@oficina.com',
          senha: 'hashed-password',
          empresaId: 'emp-1',
          provider: 'local',
          role: 'user',
        },
      });
      expect(result.id).toBe('user-1');
      expect(result.senhaHash).toBe('hashed-password');
    });

    it('should use default provider "local" and role "user" when not provided', async () => {
      mockPrisma.usuario.create.mockResolvedValue(prismaUser);

      await repository.create({
        nome: 'Maria',
        email: 'maria@oficina.com',
        senhaHash: 'hash',
        empresaId: 'emp-1',
      });

      expect(mockPrisma.usuario.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            provider: 'local',
            role: 'user',
          }),
        }),
      );
    });

    it('should use provided provider and role when given', async () => {
      const adminUser = { ...prismaUser, role: 'admin', provider: 'google' };
      mockPrisma.usuario.create.mockResolvedValue(adminUser);

      const result = await repository.create({
        nome: 'Admin',
        email: 'admin@oficina.com',
        senhaHash: 'hash',
        empresaId: 'emp-1',
        provider: 'google',
        role: 'admin',
      });

      expect(result.role).toBe('admin');
      expect(result.provider).toBe('google');
    });
  });
});
