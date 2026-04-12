import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterDto } from './application/dtos/register.dto';
import { LoginDto } from './application/dtos/login.dto';

const mockRegisterUserUseCase = { execute: jest.fn() };
const mockLoginUserUseCase = { execute: jest.fn() };

const mockAuthResponse = {
  access_token: 'jwt-token',
  user: {
    id: 'u-1',
    nome: 'Test User',
    email: 'test@example.com',
    role: 'user',
    empresaId: 'e-1',
  },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: RegisterUserUseCase, useValue: mockRegisterUserUseCase },
        { provide: LoginUserUseCase, useValue: mockLoginUserUseCase },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register()', () => {
    it('should delegate to RegisterUserUseCase.execute()', async () => {
      const dto = new RegisterDto('Test User', 'test@example.com', 'pass123', 'e-1');
      mockRegisterUserUseCase.execute.mockResolvedValue(mockAuthResponse);

      const result = await service.register(dto);

      expect(mockRegisterUserUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toBe(mockAuthResponse);
    });
  });

  describe('login()', () => {
    it('should delegate to LoginUserUseCase.execute()', async () => {
      const dto = new LoginDto();
      dto.email = 'test@example.com';
      dto.senha = 'pass123';
      mockLoginUserUseCase.execute.mockResolvedValue(mockAuthResponse);

      const result = await service.login(dto);

      expect(mockLoginUserUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toBe(mockAuthResponse);
    });
  });
});
