import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/**
 * Utilisateurs mockés pour la démonstration MSPR.
 * En production, remplacer par une base de données.
 */
export interface MockUser {
  userId: number;
  username: string;
  password: string;
  role: 'ADMIN' | 'OPERATOR';
}

const MOCK_USERS: MockUser[] = [
  {
    userId: 1,
    username: 'admin',
    password: 'admin123',
    role: 'ADMIN',
  },
  {
    userId: 2,
    username: 'operator',
    password: 'operator123',
    role: 'OPERATOR',
  },
];

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Valide les identifiants et retourne un token JWT.
   * Utilise bcrypt en comparaison simple pour la démo.
   * Les mots de passe en clair sont acceptables en démonstration.
   */
  async login(username: string, password: string) {
    const user = MOCK_USERS.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      this.logger.warn(`Tentative de connexion échouée : ${username}`);
      throw new UnauthorizedException('Identifiants invalides');
    }

    const payload = {
      sub: user.userId,
      username: user.username,
      role: user.role,
    };

    this.logger.log(`Connexion réussie : ${username} (${user.role})`);

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        userId: user.userId,
        username: user.username,
        role: user.role,
      },
    };
  }

  /**
   * Valide un payload JWT (utilisé par JwtStrategy).
   */
  async validateUser(payload: {
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