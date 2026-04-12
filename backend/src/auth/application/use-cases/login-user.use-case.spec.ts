import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserUseCase } from './login-user.use-case';
import {
  IUsersRepository,
  UserDomain,
} from '../../domain/ports/users-repository.port';
import { LoginDto } from '../dtos/login.dto';

jest.mock('bcrypt');

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let mockUsersRepository: jest.Mocked<IUsersRepository>;
  let mockJwtService: jest.Mocked<JwtService>;

  const mockUser: UserDomain = {
    id: 'user-1',
    nome: 'João Silva',
    email: 'joao@oficina.com',
    senhaHash: 'hashed-password',
    provider: 'local',
    role: 'user',
    empresaId: 'emp-1',
  };

  beforeEach(() => {
    mockUsersRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('jwt-token-123'),
    } as unknown as jest.Mocked<JwtService>;

    useCase = new LoginUserUseCase(mockUsersRepository, mockJwtService);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  });

  it('should return access_token and user data on valid credentials', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(mockUser);

    const dto: LoginDto = { email: 'joao@oficina.com', senha: 'senha123' };
    const result = await useCase.execute(dto);

    expect(result.access_token).toBe('jwt-token-123');
    expect(result.user.id).toBe('user-1');
    expect(result.user.nome).toBe('João Silva');
    expect(result.user.email).toBe('joao@oficina.com');
    expect(result.user.role).toBe('user');
    expect(result.user.empresaId).toBe('emp-1');
  });

  it('should sign JWT with correct payload', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(mockUser);

    const dto: LoginDto = { email: 'joao@oficina.com', senha: 'senha123' };
    await useCase.execute(dto);

    expect(mockJwtService.sign).toHaveBeenCalledWith({
      sub: 'user-1',
      email: 'joao@oficina.com',
      role: 'user',
      empresaId: 'emp-1',
    });
  });

  it('should throw UnauthorizedException when user not found', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);

    const dto: LoginDto = { email: 'naoexiste@email.com', senha: 'senha123' };

    await expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedException);
    await expect(useCase.execute(dto)).rejects.toThrow('Credenciais inválidas');
  });

  it('should throw UnauthorizedException when password is wrong', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const dto: LoginDto = { email: 'joao@oficina.com', senha: 'senhaerrada' };

    await expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedException);
    await expect(useCase.execute(dto)).rejects.toThrow('Credenciais inválidas');
  });

  it('should throw UnauthorizedException when user has no local password', async () => {
    const googleUser: UserDomain = { ...mockUser, senhaHash: null, provider: 'google' };
    mockUsersRepository.findByEmail.mockResolvedValue(googleUser);

    const dto: LoginDto = { email: 'joao@oficina.com', senha: 'qualquersenha' };

    await expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedException);
    await expect(useCase.execute(dto)).rejects.toThrow('Usuário sem senha local configurada');
  });
});
