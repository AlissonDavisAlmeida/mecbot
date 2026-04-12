jest.mock('@/generated/prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => ({
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      conversa: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      mensagem: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      usuario: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    })),
  };
});
