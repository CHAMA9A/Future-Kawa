import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';

/**
 * AuthModule
 *
 * Module d'authentification JWT pour FutureKawa.
 * Met à disposition :
 * - POST /api/auth/login -> retourne un token JWT
 * - Guards : JwtAuthGuard, RolesGuard
 * - Roles : ADMIN, OPERATOR
 *
 * Les utilisateurs sont mockés pour la démonstration MSPR.
 * En production, remplacer par une vraie base de données.
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'futurekawa-demo-secret-2025',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [JwtModule, JwtStrategy, RolesGuard, AuthService],
})
export class AuthModule {}