import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

/**
 * EmailService
 *
 * Service d'envoi d'emails via SMTP (MailHog).
 * En mode Docker, MailHog est accessible via le hostname "mailhog".
 * En mode développement local, utiliser "localhost".
 *
 * Fonctionnalités :
 * - Envoi d'alerte température
 * - Envoi d'alerte humidité
 * - Envoi d'alerte lot périmé
 * - Email test de démonstration
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private smtpHost: string;

  constructor() {
    this.smtpHost = process.env.MAILHOG_HOST || 'localhost';
    const smtpPort = parseInt(process.env.MAILHOG_PORT || '1025', 10);

    this.transporter = nodemailer.createTransport({
      host: this.smtpHost,
      port: smtpPort,
      ignoreTLS: true,
    });

    this.logger.log(
      `Service email configuré : ${this.smtpHost}:${smtpPort} (MailHog)`,
    );
  }

  /**
   * Envoie un email d'alerte générique.
   */
  async sendAlertEmail(params: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: '"FutureKawa Alertes" <alerts@futurekawa.com>',
        to: params.to,
        subject: params.subject,
        text: params.text,
        html: params.html || params.text.replace(/\n/g, '<br>'),
      });

      this.logger.log(
        `Email envoyé avec succès : "${params.subject}" -> ${params.to} (id: ${info.messageId})`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Échec envoi email : "${params.subject}" -> ${params.to} : ${error.message}`,
      );
      return false;
    }
  }

  /**
   * Envoie une alerte de température.
   */
  async sendTemperatureAlert(
    country: string,
    temperature: number,
    warehouse: string,
    min: number,
    max: number,
  ) {
    const subject = `🔴 ALERTE Température - ${country} - ${warehouse}`;
    const text = [
      `Alerte température - FutureKawa`,
      `--------------------------------`,
      `Pays : ${country}`,
      `Entrepôt : ${warehouse}`,
      `Température relevée : ${temperature}°C`,
      `Plage normale : ${min}°C - ${max}°C`,
      `Date : ${new Date().toISOString()}`,
      ``,
      `Action requise : Vérifier les conditions de stockage.`,
    ].join('\n');

    return this.sendAlertEmail({
      to: `${country.toLowerCase()}@futurekawa.com`,
      subject,
      text,
    });
  }

  /**
   * Envoie une alerte d'humidité.
   */
  async sendHumidityAlert(
    country: string,
    humidity: number,
    warehouse: string,
    min: number,
    max: number,
  ) {
    const subject = `🔵 ALERTE Humidité - ${country} - ${warehouse}`;
    const text = [
      `Alerte humidité - FutureKawa`,
      `-----------------------------`,
      `Pays : ${country}`,
      `Entrepôt : ${warehouse}`,
      `Humidité relevée : ${humidity}%`,
      `Plage normale : ${min}% - ${max}%`,
      `Date : ${new Date().toISOString()}`,
      ``,
      `Action requise : Vérifier les conditions de stockage.`,
    ].join('\n');

    return this.sendAlertEmail({
      to: `${country.toLowerCase()}@futurekawa.com`,
      subject,
      text,
    });
  }

  /**
   * Envoie une alerte de lot périmé.
   */
  async sendExpiredLotAlert(
    country: string,
    lotCode: string,
    warehouse: string,
    storageDate: string,
  ) {
    const subject = `⚠️ ALERTE Lot Périmé - ${country} - ${lotCode}`;
    const text = [
      `Alerte lot périmé - FutureKawa`,
      `-------------------------------`,
      `Pays : ${country}`,
      `Lot : ${lotCode}`,
      `Entrepôt : ${warehouse}`,
      `Date de stockage : ${storageDate}`,
      `Date de détection : ${new Date().toISOString()}`,
      ``,
      `Action requise : Retirer le lot de la chaîne d'expédition.`,
    ].join('\n');

    return this.sendAlertEmail({
      to: `${country.toLowerCase()}@futurekawa.com`,
      subject,
      text,
    });
  }

  /**
   * Envoie un email de test pour vérifier que MailHog fonctionne.
   */
  async sendTestEmail(): Promise<any> {
    const result = await this.sendAlertEmail({
      to: 'test@futurekawa.com',
      subject: 'Test FutureKawa - Vérification MailHog',
      text: [
        'Ceci est un email de test depuis FutureKawa.',
        '',
        `Date d'envoi : ${new Date().toISOString()}`,
        `Service : Backend Central (port 3002)`,
        `SMTP : ${this.smtpHost}:1025`,
        '',
        'Si vous lisez ce message, MailHog fonctionne correctement.',
      ].join('\n'),
    });

    return {
      success: result,
      message: result
        ? 'Email de test envoyé avec succès. Vérifiez MailHog UI (http://localhost:8025).'
        : 'Échec de l\'envoi. Vérifiez que MailHog est en cours d\'exécution.',
      smtpHost: this.smtpHost,
      smtpPort: 1025,
      mailhogUiUrl: 'http://localhost:8025',
    };
  }
}