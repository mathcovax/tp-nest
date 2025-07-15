import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST', 'maildev'),
      port: this.configService.get<number>('EMAIL_PORT', 1025),
      secure: false,
      auth: false,
    } as nodemailer.TransportOptions);
  }

  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000')}/auth/verify-email?token=${token}`;

    const mailOptions = {
      from: this.configService.get<string>(
        'EMAIL_FROM',
        'noreply@watchlist.com',
      ),
      to: email,
      subject: '🎬 Vérification de votre compte Watchlist',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e50914;">🎬 Bienvenue sur Watchlist !</h2>
          <p>Merci de vous être inscrit ! Cliquez sur le lien ci-dessous pour vérifier votre adresse email :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #e50914; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              ✅ Vérifier mon email
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Si le lien ne fonctionne pas, copiez-collez cette URL :</p>
          <p style="color: #666; font-size: 12px; word-break: break-all;">${verificationUrl}</p>
          <p style="color: #666; font-size: 12px;">Ce lien expire dans 24 heures.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendTwoFactorCode(email: string, code: string) {
    const mailOptions = {
      from: this.configService.get<string>(
        'EMAIL_FROM',
        'noreply@watchlist.com',
      ),
      to: email,
      subject: '🔐 Code de connexion Watchlist',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e50914;">🔐 Code de vérification</h2>
          <p>Votre code de connexion à 2 facteurs est :</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f8f9fa; border: 2px solid #e50914; padding: 20px; border-radius: 10px; display: inline-block;">
              <h1 style="color: #e50914; font-size: 36px; margin: 0; letter-spacing: 8px;">${code}</h1>
            </div>
          </div>
          <p style="color: #666;">Ce code expire dans <strong>5 minutes</strong>.</p>
          <p style="color: #666; font-size: 14px;">Si vous n'avez pas demandé ce code, ignorez ce message.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
