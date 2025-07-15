import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GlobalModule } from 'src/global/global.module';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { CryptService } from './services/crypt.service';
import { EmailService } from './services/email.service';
import { VerificationService } from './services/verification.service';
import { MustBeConnectedGuard } from './guards/mustBeConnected.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [GlobalModule, ConfigModule],
  controllers: [AuthController],
  providers: [
    TokenService,
    AuthService,
    CryptService,
    EmailService,
    VerificationService,
    MustBeConnectedGuard,
  ],
  exports: [MustBeConnectedGuard, TokenService],
})
export class AuthModule {}
