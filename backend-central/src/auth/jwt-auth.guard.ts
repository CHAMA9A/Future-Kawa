import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

/**
 * JwtAuthGuard
 *
 * Guard simple qui exige un token JWT valide.
 * Peut être utilisé directement ou via RolesGuard.
 *
 * Utilisation :
 * @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
}