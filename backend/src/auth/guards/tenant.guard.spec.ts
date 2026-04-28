import { ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TenantGuard } from './tenant.guard';
import { SKIP_TENANT_KEY } from '../decorators/skip-tenant.decorator';
import { type AuthenticatedUser } from '../domain/types/jwt-payload.type';

describe('TenantGuard', () => {
  let guard: TenantGuard;
  let mockReflector: jest.Mocked<Reflector>;

  const makeUser = (empresaId: string): AuthenticatedUser => ({
    userId: 'u-1',
    email: 'user@empresa.com',
    role: 'user',
    empresaId,
  });

  const makeContext = (
    user: AuthenticatedUser | undefined,
    params: Record<string, string> = {},
    query: Record<string, string> = {},
    body: Record<string, unknown> = {},
  ): ExecutionContext =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user, params, query, body }),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    mockReflector = { getAllAndOverride: jest.fn() } as unknown as jest.Mocked<Reflector>;
    guard = new TenantGuard(mockReflector);
    mockReflector.getAllAndOverride.mockReturnValue(false);
  });

  describe('@SkipTenant()', () => {
    it('deve permitir acesso quando a rota tem @SkipTenant()', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);
      const ctx = makeContext(undefined);

      expect(guard.canActivate(ctx)).toBe(true);
    });

    it('deve usar SKIP_TENANT_KEY na verificação do reflector', () => {
      mockReflector.getAllAndOverride.mockReturnValue(true);
      const ctx = makeContext(makeUser('e-1'));

      guard.canActivate(ctx);

      expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
        SKIP_TENANT_KEY,
        [ctx.getHandler(), ctx.getClass()],
      );
    });
  });

  describe('sem empresaId no request', () => {
    it('deve permitir acesso quando o request não contém empresaId', () => {
      const ctx = makeContext(makeUser('e-1'));

      expect(guard.canActivate(ctx)).toBe(true);
    });
  });

  describe('empresaId via route param', () => {
    it('deve permitir acesso quando empresaId do param bate com o do JWT', () => {
      const ctx = makeContext(makeUser('e-1'), { empresaId: 'e-1' });

      expect(guard.canActivate(ctx)).toBe(true);
    });

    it('deve lançar ForbiddenException quando empresaId do param não bate com o do JWT', () => {
      const ctx = makeContext(makeUser('e-1'), { empresaId: 'e-outro' });

      expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    });
  });

  describe('empresaId via query param', () => {
    it('deve permitir acesso quando empresaId da query bate com o do JWT', () => {
      const ctx = makeContext(makeUser('e-2'), {}, { empresaId: 'e-2' });

      expect(guard.canActivate(ctx)).toBe(true);
    });

    it('deve lançar ForbiddenException quando empresaId da query não bate com o do JWT', () => {
      const ctx = makeContext(makeUser('e-2'), {}, { empresaId: 'e-outro' });

      expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    });
  });

  describe('empresaId via body', () => {
    it('deve permitir acesso quando empresaId do body bate com o do JWT', () => {
      const ctx = makeContext(makeUser('e-3'), {}, {}, { empresaId: 'e-3' });

      expect(guard.canActivate(ctx)).toBe(true);
    });

    it('deve lançar ForbiddenException quando empresaId do body não bate com o do JWT', () => {
      const ctx = makeContext(makeUser('e-3'), {}, {}, { empresaId: 'e-outro' });

      expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
    });
  });

  describe('prioridade de resolução', () => {
    it('deve preferir param sobre query e body', () => {
      const ctx = makeContext(
        makeUser('e-correto'),
        { empresaId: 'e-correto' },
        { empresaId: 'e-errado-query' },
        { empresaId: 'e-errado-body' },
      );

      expect(guard.canActivate(ctx)).toBe(true);
    });

    it('deve preferir query sobre body quando param ausente', () => {
      const ctx = makeContext(
        makeUser('e-correto'),
        {},
        { empresaId: 'e-correto' },
        { empresaId: 'e-errado-body' },
      );

      expect(guard.canActivate(ctx)).toBe(true);
    });
  });

  describe('usuário não autenticado', () => {
    it('deve lançar UnauthorizedException quando req.user está ausente', () => {
      const ctx = makeContext(undefined, { empresaId: 'e-1' });

      expect(() => guard.canActivate(ctx)).toThrow(UnauthorizedException);
    });
  });

  describe('mensagem de erro', () => {
    it('deve incluir mensagem descritiva no ForbiddenException', () => {
      const ctx = makeContext(makeUser('e-1'), { empresaId: 'e-outro' });

      expect(() => guard.canActivate(ctx)).toThrow(
        'Acesso negado: recurso não pertence à sua empresa',
      );
    });
  });
});
