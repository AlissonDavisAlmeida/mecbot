/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { LoginUserUseCase } from './application/use-cases/login-user.use-case';
import { UsersRepository } from './infrastructure/repositories/users.repository';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { USERS_REPOSITORY_TOKEN } from './domain/ports/users-repository.port';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TenantGuard } from './guards/tenant.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<any>('JWT_EXPIRES_IN', '7d'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RegisterUserUseCase,
    LoginUserUseCase,
    JwtStrategy,
    JwtAuthGuard,
    TenantGuard,
    { provide: USERS_REPOSITORY_TOKEN, useClass: UsersRepository },
  ],
  exports: [JwtAuthGuard, TenantGuard, JwtModule],
})
export class AuthModule {}
