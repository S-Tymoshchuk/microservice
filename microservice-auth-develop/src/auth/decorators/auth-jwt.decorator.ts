import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { RolesGuard } from '@decorators/role.guard';
import { IAuthJWTGuardOptions } from '@decorators/auth-guard.options';
import { GrpcAuthGuard } from '../grpcAuthGuard.strategy';

export function AuthJWT(options?: IAuthJWTGuardOptions) {
  const opts = { applySwaggerGuard: true, ...options };
  const decorators = [SetMetadata('roleGuardOptions', opts.roleGuard), UseGuards(GrpcAuthGuard, RolesGuard)];

  return applyDecorators(...decorators);
}
