import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserUseCase } from './register-user.use-case';
import {
  IUsersRepository,
  UserDomain,
} from '../../domain/ports/users-repository.port';
import { RegisterDto } from '../dtos/register.dto';

jest.mock('bcrypt');

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let mockUsersRepository: jest.Mocked<IUsersRepository>;

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

    useCase = new RegisterUserUseCase(mockUsersRepository);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
  });

  it('should register a new user successfully', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);
    mockUsersRepository.create.mockResolvedValue(mockUser);

    const dto = new RegisterDto('João Silva', 'joao@oficina.com', 'senha123', 'emp-1');
    const result = await useCase.execute(dto);

    expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith('joao@oficina.com');
    expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
    expect(mockUsersRepository.create).toHaveBeenCalledWith({
      nome: 'João Silva',
      email: 'joao@oficina.com',
      senhaHash: 'hashed-password',
      empresaId: 'emp-1',
    });
    expect(result).not.toHaveProperty('senhaHash');
    expect(result.email).toBe('joao@oficina.com');
  });

  it('should throw ConflictException when email already exists', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(mockUser);

    const dto = new RegisterDto('João Silva', 'joao@oficina.com', 'senha123', 'emp-1');

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
    await expect(useCase.execute(dto)).rejects.toThrow('E-mail já cadastrado');
    expect(mockUsersRepository.create).not.toHaveBeenCalled();
  });

  it('should not expose password hash in the response', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);
    mockUsersRepository.create.mockResolvedValue(mockUser);

    const dto = new RegisterDto('João Silva', 'joao@oficina.com', 'senha123', 'emp-1');
    const result = await useCase.execute(dto);

    expect(result).not.toHaveProperty('senhaHash');
    expect(result.id).toBe('user-1');
    expect(result.nome).toBe('João Silva');
    expect(result.role).toBe('user');
    expect(result.empresaId).toBe('emp-1');
  });
});
