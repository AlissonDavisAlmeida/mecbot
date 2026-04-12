import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from '../../domain/types/jwt-payload.type';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(() => {
    mockConfigService = {
      getOrThrow: jest.fn().mockReturnValue('test-jwt-secret'),
    } as unknown as jest.Mocked<ConfigService>;

    strategy = new JwtStrategy(mockConfigService);
  });

  describe('validate', () => {
    it('should return AuthenticatedUser for a valid payload', () => {
      const payload: JwtPayload = {
        sub: 'user-1',
        email: 'joao@oficina.com',
        role: 'user',
        empresaId: 'emp-1',
      };

      const result = strategy.validate(payload);

      expect(result.userId).toBe('user-1');
      expect(result.email).toBe('joao@oficina.com');
      expect(result.role).toBe('user');
      expect(result.empresaId).toBe('emp-1');
    });

    it('should throw UnauthorizedException when sub is missing', () => {
      const payload = { email: 'joao@oficina.com', role: 'user', empresaId: 'emp-1' } as JwtPayload;

      expect(() => strategy.validate(payload)).toThrow(UnauthorizedException);
      expect(() => strategy.validate(payload)).toThrow('Token inválido');
    });

    it('should throw UnauthorizedException when email is missing', () => {
      const payload = { sub: 'user-1', role: 'user', empresaId: 'emp-1' } as JwtPayload;

      expect(() => strategy.validate(payload)).toThrow(UnauthorizedException);
    });

    it('should read JWT_SECRET from config', () => {
      expect(mockConfigService.getOrThrow).toHaveBeenCalledWith('JWT_SECRET');
    });
  });
});
