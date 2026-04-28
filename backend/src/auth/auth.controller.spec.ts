import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RegisterDto } from './application/dtos/register.dto';
import { LoginDto } from './application/dtos/login.dto';
import { AuthenticatedUser } from './domain/types/jwt-payload.type';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

const mockAuthResponseDto = {
  access_token: 'jwt-token',
  user: {
    id: 'u-1',
    nome: 'Test User',
    email: 'test@example.com',
    role: 'user',
    empresaId: 'e-1',
  },
};

const mockCurrentUser: AuthenticatedUser = {
  userId: 'u-1',
  email: 'test@example.com',
  role: 'user',
  empresaId: 'e-1',
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register()', () => {
    it('should delegate to authService.register() and return the result', async () => {
      const dto = new RegisterDto('Test User', 'test@example.com', 'pass123', 'e-1');
      mockAuthService.register.mockResolvedValue(mockAuthResponseDto);

      const result = await controller.register(dto);

      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(result).toBe(mockAuthResponseDto);
    });
  });

  describe('login()', () => {
    it('should delegate to authService.login() and return the result', async () => {
      const dto = new LoginDto();
      dto.email = 'test@example.com';
      dto.senha = 'pass123';
      mockAuthService.login.mockResolvedValue(mockAuthResponseDto);

      const result = await controller.login(dto);

      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
      expect(result).toBe(mockAuthResponseDto);
    });
  });

  describe('me()', () => {
    it('should return the current user extracted from JWT', () => {
      const result = controller.me(mockCurrentUser);

      expect(result).toBe(mockCurrentUser);
    });
  });
});
