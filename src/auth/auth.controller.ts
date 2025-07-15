import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/decorators/public';
import { RegisterDto } from './dto/register';
import { LoginDto } from './dto/login';
import {
  VerifyEmailDto,
  TwoFactorDto,
  VerifyTwoFactorDto,
} from './dto/verification.dto';
import { AuthService } from './services/auth.service';
import { Response } from 'express';
import { GetUser, MustBeConnectedGuard } from './guards/mustBeConnected.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { User } from '@prisma/client';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Inscription avec validation par email' })
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    try {
      const result = await this.authService.register(body);
      res.status(201).json(result);
    } catch (error: unknown) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Connexion (étape 1 - envoi du code 2FA)' })
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      const result = await this.authService.login(body);
      res.status(200).json(result);
    } catch (error: unknown) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  @Public()
  @Post('verify-2fa')
  @ApiOperation({
    summary: 'Vérification du code 2FA et récupération du token',
  })
  async verifyTwoFactor(
    @Body() body: VerifyTwoFactorDto,
    @Res() res: Response,
  ) {
    try {
      const token = await this.authService.verifyTwoFactorAndLogin(body);
      res.status(200).json({ token });
    } catch (error: unknown) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  @Public()
  @Get('verify-email')
  @ApiOperation({ summary: "Vérification de l'email" })
  async verifyEmail(@Query() query: VerifyEmailDto, @Res() res: Response) {
    try {
      const result = await this.authService.verifyEmail(query.token);
      res.status(200).json(result);
    } catch (error: unknown) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  @Public()
  @Post('resend-verification')
  @ApiOperation({ summary: "Renvoyer l'email de vérification" })
  async resendVerification(@Body() body: TwoFactorDto, @Res() res: Response) {
    try {
      const result = await this.authService.resendVerificationEmail(body.email);
      res.status(200).json(result);
    } catch (error: unknown) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      });
    }
  }

  @Get('profile')
  @ApiOperation({ summary: 'Récupérer le profil utilisateur' })
  @ApiBearerAuth()
  @UseGuards(MustBeConnectedGuard)
  getProfile(@GetUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
    };
  }
}
