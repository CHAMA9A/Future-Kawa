import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EmailService } from './email.service';

/**
 * EmailController
 *
 * Endpoints de test pour la démonstration MailHog.
 * GET /api/central/email/test-alert -> envoie un email test
 */
@ApiTags('email')
@Controller('api/central/email')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  constructor(private readonly emailService: EmailService) {}

  @Get('test-alert')
  @ApiOperation({
    summary: 'Envoyer un email test',
    description:
      'Envoie un email de test via MailHog. Vérifier http://localhost:8025 pour voir le résultat.',
  })
  @ApiResponse({
    status: 200,
    description: 'Résultat de l\'envoi de l\'email test',
  })
  async sendTestAlert() {
    this.logger.log('Demande d\'envoi d\'email test');
    return this.emailService.sendTestEmail();
  }

  @Get('send-temperature-alert')
  @ApiOperation({
    summary: 'Simuler une alerte température',
    description:
      'Envoie un email simulé d\'alerte température via MailHog pour la démonstration.',
  })
  @ApiResponse({
    status: 200,
    description: 'Email d\'alerte température envoyé',
  })
  async sendTemperatureAlert() {
    return this.emailService.sendTemperatureAlert(
      'Colombia',
      40,
      'Warehouse Colombia 1',
      30,
      36,
    );
  }

  @Get('send-humidity-alert')
  @ApiOperation({
    summary: 'Simuler une alerte humidité',
    description:
      'Envoie un email simulé d\'alerte humidité via MailHog pour la démonstration.',
  })
  @ApiResponse({
    status: 200,
    description: 'Email d\'alerte humidité envoyé',
  })
  async sendHumidityAlert() {
    return this.emailService.sendHumidityAlert(
      'Ecuador',
      70,
      'Warehouse Ecuador 1',
      58,
      62,
    );
  }
}