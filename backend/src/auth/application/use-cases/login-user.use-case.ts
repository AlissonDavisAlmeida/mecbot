import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
 type IUsersRepository,
  USERS_REPOSITORY_TOKEN,
} from '../../domain/ports/users-repository.port';
import { LoginDto } from '../dtos/login.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: IUsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.senhaHash) {
      throw new UnauthorizedException('Usuário sem senha local configurada');
    }

    const isPasswordValid = await bcrypt.compare(dto.senha, user.senhaHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      empresaId: user.empresaId,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
        empresaId: user.empresaId,
      },
    };
  }
}
