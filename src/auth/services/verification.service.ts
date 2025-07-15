import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/prisma.service';
import { EmailService } from './email.service';
import { randomBytes } from 'crypto';

@Injectable()
export class VerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  generateEmailVerificationToken(): string {
    return randomBytes(32).toString('hex');
  }

  generateTwoFactorCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendEmailVerification(userId: number, email: string) {
    const token = this.generateEmailVerificationToken();

    await this.prisma.user.update({
      where: { id: userId },
      data: { emailVerificationToken: token },
    });

    await this.emailService.sendVerificationEmail(email, token);
  }

  async verifyEmail(token: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return false;
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
      },
    });

    return true;
  }

  async sendTwoFactorCode(email: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user || !user.isEmailVerified) {
      return false;
    }

    const code = this.generateTwoFactorCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode: code,
        twoFactorExpiresAt: expiresAt,
      },
    });

    await this.emailService.sendTwoFactorCode(email, code);
    return true;
  }

  async verifyTwoFactorCode(email: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user || !user.twoFactorCode || !user.twoFactorExpiresAt) {
      return false;
    }

    if (new Date() > user.twoFactorExpiresAt) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorCode: null,
          twoFactorExpiresAt: null,
        },
      });
      return false;
    }

    if (user.twoFactorCode === code) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorCode: null,
          twoFactorExpiresAt: null,
        },
      });
      return true;
    }

    return false;
  }
}
