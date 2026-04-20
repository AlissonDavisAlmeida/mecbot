import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { type AuthenticatedUser } from '../domain/types/jwt-payload.type';
import { SKIP_TENANT_KEY } from '../decorators/skip-tenant.decorator';

/**
 * Garante que o usuário autenticado só acesse recursos da sua própria empresa.
 *
 * Estratégia de resolução do empresaId do request (por ordem de prioridade):
 *   1. Route param  → /empresas/:empresaId/...
 *   2. Query param  → ?empresaId=...
 *   3. Body field   → { empresaId: "..." }
 *
 * Se nenhuma das fontes acima contiver empresaId, a rota é considerada
 * sem escopo de tenant e o acesso é permitido.
 *
 * Use @SkipTenant() em rotas que não devem passar por esta verificação.
 *
 * IMPORTANTE: deve ser aplicado APÓS JwtAuthGuard, pois depende de req.user.
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_TENANT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skip) return true;

    const request = context.switchToHttp().getRequest<{
      user?: AuthenticatedUser;
      params?: Record<string, string>;
      query?: Record<string, string>;
      body?: Record<string, unknown>;
    }>();

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    const requestEmpresaId =
      request.params?.['empresaId'] ??
      request.query?.['empresaId'] ??
      (request.body?.['empresaId'] as string | undefined);

    // Rota sem escopo de tenant → permite acesso
    if (!requestEmpresaId) return true;

    if (user.empresaId !== requestEmpresaId) {
      throw new ForbiddenException(
        'Acesso negado: recurso não pertence à sua empresa',
      );
    }

    return true;
  }
}
