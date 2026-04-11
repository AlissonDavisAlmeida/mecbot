export class PrismaService {
  conversa = {
    findFirst: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
  };

  mensagem = {
    create: jest.fn(),
    findMany: jest.fn(),
  };

  async $connect() {
    return Promise.resolve();
  }

  async $disconnect() {
    return Promise.resolve();
  }
}
