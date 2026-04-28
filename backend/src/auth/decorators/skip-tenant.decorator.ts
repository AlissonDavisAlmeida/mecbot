import { SetMetadata } from '@nestjs/common';

export const SKIP_TENANT_KEY = 'skipTenant';

/**
 * Marca uma rota para ignorar a verificação de tenant (TenantGuard).
 * Use em rotas públicas ou que não envolvem recursos de uma empresa específica.
 */
export const SkipTenant = () => SetMetadata(SKIP_TENANT_KEY, true);
