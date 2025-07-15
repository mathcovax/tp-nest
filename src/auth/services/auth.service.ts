import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/global/prisma.service';
import { CryptService } from './crypt.service';
import { TokenService } from './token.service';
import { VerificationService } from './verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptService: CryptService,
    private readonly tokenService: TokenService,
    private readonly verificationService: VerificationService,
  ) {}

  async register({ email, password }: { email: string; password: string }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException(
        'Un utilisateur avec cet email existe déjà',
      );
    }

    const hashedPassword = await this.cryptService.hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    await this.verificationService.sendEmailVerification(user.id, email);

    return {
      message:
        'Inscription réussie. Vérifiez votre email pour activer votre compte.',
    };
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isMatch = await this.cryptService.comparePassword(
      password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Veuillez vérifier votre email avant de vous connecter',
      );
    }

    await this.verificationService.sendTwoFactorCode(email);

    return { message: 'Un code de vérification a été envoyé à votre email' };
  }

  async verifyTwoFactorAndLogin({
    email,
    code,
  }: {
    email: string;
    code: string;
  }) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const isValidCode = await this.verificationService.verifyTwoFactorCode(
      email,
      code,
    );
    if (!isValidCode) {
      throw new UnauthorizedException(
        'Code de vérification incorrect ou expiré',
      );
    }

    return this.tokenService.generateToken({
      userId: user.id,
    });
  }

  async verifyEmail(token: string) {
    const isValid = await this.verificationService.verifyEmail(token);
    if (!isValid) {
      throw new BadRequestException('Token de vérification invalide ou expiré');
    }

    return { message: 'Email vérifié avec succès' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Utilisateur non trouvé');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email déjà vérifié');
    }

    await this.verificationService.sendEmailVerification(user.id, email);
    return { message: 'Email de vérification renvoyé' };
  }
}
