import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';

/**
 * AuthController
 *
 * Point d'entrée pour l'authentification.
 * POST /api/auth/login -> retourne un token JWT.
 */
@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Authentification utilisateur',
    description:
      'Retourne un token JWT valide 24h. Utilisateurs disponibles : admin/admin123 (ADMIN), operator/operator123 (OPERATOR)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'admin' },
        password: { type: 'string', example: 'admin123' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Authentification réussie, token JWT retourné',
  })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async login(@Body() credentials: { username: string; password: string }) {
    this.logger.log(
      `Tentative de connexion : ${credentials?.username || 'inconnu'}`,
    );
    return this.authService.login(credentials.username, credentials.password);
  }
}