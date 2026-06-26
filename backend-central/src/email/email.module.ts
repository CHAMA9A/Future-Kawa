import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

/**
 * EmailModule
 *
 * Module d'envoi d'emails via MailHog (SMTP local).
 * MailHog est un service de test SMTP qui capture les emails
 * et les rend visibles dans une interface web.
 *
 * Configuration SMTP :
 * - Hôte : localhost (ou mailhog dans Docker)
 * - Port : 1025
 * - Pas d'authentification
 *
 * Interface MailHog UI : http://localhost:8025
 */
@Module({
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}