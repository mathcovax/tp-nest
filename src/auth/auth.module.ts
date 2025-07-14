import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GlobalModule } from 'src/global/global.module';
import { TokenService } from './services/token.service';
import { AuthService } from './services/auth.service';
import { CryptService } from './services/crypt.service';
import { MustBeConnectedGuard } from './guards/mustBeConnected';

@Module({
  imports: [GlobalModule],
  controllers: [AuthController],
  providers: [TokenService, AuthService, CryptService, MustBeConnectedGuard],
  exports: [],
})
export class AuthModule {}
