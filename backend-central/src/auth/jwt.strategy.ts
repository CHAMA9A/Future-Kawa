import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JwtStrategy
 *
 * Stratégie Passport pour valider les tokens JWT.
 * Extrait le token du header Authorization: Bearer <token>.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'futurekawa-demo-secret-2025',
    });
  }

  /**
   * Validé par Passport après vérification du token.
   * Les infos sont injectées dans la requête (req.user).
   */
  async validate(payload: {
    sub: number;
    username: string;
    role: string;
  }) {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}