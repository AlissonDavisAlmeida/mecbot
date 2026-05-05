import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserUseCase } from './register-user.use-case';
import {
  IUsersRepository,
  UserDomain,
} from '../../domain/ports/users-repository.port';
import {
  EmpresaDomain,
  IEmpresasRepository,
} from '../../domain/ports/empresas-repository.port';
import { RegisterDto } from '../dtos/register.dto';

jest.mock('bcrypt');

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let mockUsersRepository: jest.Mocked<IUsersRepository>;
  let mockEmpresasRepository: jest.Mocked<IEmpresasRepository>;

  const mockEmpresa: EmpresaDomain = {
    id: 'emp-1',
    nome: 'Oficina do João',
    createdAt: new Date(),
  };

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

    mockEmpresasRepository = {
      create: jest.fn(),
    };

    useCase = new RegisterUserUseCase(mockUsersRepository, mockEmpresasRepository);
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
  });

  it('should create empresa and register user successfully', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);
    mockEmpresasRepository.create.mockResolvedValue(mockEmpresa);
    mockUsersRepository.create.mockResolvedValue(mockUser);

    const dto = new RegisterDto('João Silva', 'joao@oficina.com', 'senha123', 'Oficina do João');
    const result = await useCase.execute(dto);

    expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith('joao@oficina.com');
    expect(mockEmpresasRepository.create).toHaveBeenCalledWith('Oficina do João');
    expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
    expect(mockUsersRepository.create).toHaveBeenCalledWith({
      nome: 'João Silva',
      email: 'joao@oficina.com',
      senhaHash: 'hashed-password',
      empresaId: 'emp-1',
    });
    expect(result).not.toHaveProperty('senhaHash');
    expect(result.email).toBe('joao@oficina.com');
    expect(result.empresaId).toBe('emp-1');
  });

  it('should throw ConflictException when email already exists', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(mockUser);

    const dto = new RegisterDto('João Silva', 'joao@oficina.com', 'senha123', 'Oficina do João');

    await expect(useCase.execute(dto)).rejects.toThrow(ConflictException);
    await expect(useCase.execute(dto)).rejects.toThrow('E-mail já cadastrado');
    expect(mockEmpresasRepository.create).not.toHaveBeenCalled();
    expect(mockUsersRepository.create).not.toHaveBeenCalled();
  });

  it('should not expose password hash in the response', async () => {
    mockUsersRepository.findByEmail.mockResolvedValue(null);
    mockEmpresasRepository.create.mockResolvedValue(mockEmpresa);
    mockUsersRepository.create.mockResolvedValue(mockUser);

    const dto = new RegisterDto('João Silva', 'joao@oficina.com', 'senha123', 'Oficina do João');
    const result = await useCase.execute(dto);

    expect(result).not.toHaveProperty('senhaHash');
    expect(result.id).toBe('user-1');
    expect(result.nome).toBe('João Silva');
    expect(result.role).toBe('user');
    expect(result.empresaId).toBe('emp-1');
  });
});
