import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

/**
 * Décorateur @Roles('ADMIN') pour marquer les routes protégées.
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

/**
 * RolesGuard
 *
 * Guard qui vérifie que l'utilisateur authentifié possède
 * le rôle requis pour accéder à une route.
 *
 * Utilisation :
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Roles('ADMIN')
 *
 * Si aucun rôle n'est spécifié, la route est accessible
 * à tout utilisateur authentifié.
 */
@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Vérifier le JWT
    const jwtValid = await super.canActivate(context);
    if (!jwtValid) return false;

    // 2. Vérifier les rôles si spécifiés
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Pas de rôle requis = accès autorisé
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return requiredRoles.includes(user?.role);
  }
}