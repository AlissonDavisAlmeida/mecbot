import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let mockReflector: jest.Mocked<Reflector>;

  const createMockContext = (userRole: string): ExecutionContext =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user: { userId: 'u-1', email: 'a@b.com', role: userRole, empresaId: 'e-1' } }),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    mockReflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    guard = new RolesGuard(mockReflector);
  });

  it('should allow access when no roles are required', () => {
    mockReflector.getAllAndOverride.mockReturnValue(undefined);

    const result = guard.canActivate(createMockContext('user'));

    expect(result).toBe(true);
  });

  it('should allow access when roles array is empty', () => {
    mockReflector.getAllAndOverride.mockReturnValue([]);

    const result = guard.canActivate(createMockContext('user'));

    expect(result).toBe(true);
  });

  it('should allow access when user has the required role', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['admin']);

    const result = guard.canActivate(createMockContext('admin'));

    expect(result).toBe(true);
  });

  it('should deny access when user does not have the required role', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['admin']);

    const result = guard.canActivate(createMockContext('user'));

    expect(result).toBe(false);
  });

  it('should allow access when user has one of multiple required roles', () => {
    mockReflector.getAllAndOverride.mockReturnValue(['admin', 'manager']);

    const result = guard.canActivate(createMockContext('manager'));

    expect(result).toBe(true);
  });

  it('should use ROLES_KEY metadata key', () => {
    mockReflector.getAllAndOverride.mockReturnValue(undefined);
    const ctx = createMockContext('user');

    guard.canActivate(ctx);

    expect(mockReflector.getAllAndOverride).toHaveBeenCalledWith(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
  });
});
