import { Injectable } from '@nestjs/common';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { RegisterDto } from './application/dtos/register.dto';
import { LoginDto } from './application/dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  register(dto: RegisterDto) {
    return this.registerUserUseCase.execute(dto);
  }

  login(dto: LoginDto) {
    return this.loginUserUseCase.execute(dto);
  }
}
