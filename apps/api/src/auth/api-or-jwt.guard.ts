import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokensService, TOKEN_PREFIX } from '../tokens/tokens.service';

/**
 * Accepts either a JWT (admin UI login) or a long-lived API token (jos_...)
 * in the Authorization: Bearer <token> header.
 */
@Injectable()
export class ApiOrJwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly tokens: TokensService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth: string | undefined = req.headers.authorization;
    const raw = auth?.startsWith('Bearer ') ? auth.slice(7) : undefined;

    if (raw?.startsWith(TOKEN_PREFIX)) {
      const ok = await this.tokens.validate(raw);
      if (!ok) throw new UnauthorizedException('Invalid API token');
      req.user = { type: 'api_token' };
      return true;
    }

    return (await super.canActivate(context)) as boolean;
  }
}
