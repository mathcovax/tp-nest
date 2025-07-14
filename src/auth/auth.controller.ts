import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorators/public';
import { RegisterDto } from './dto/register';
import { LoginDto } from './dto/login';
import { AuthService } from './services/auth.service';
import { Response } from 'express';
import { GetUser, MustBeConnectedGuard } from './guards/mustBeConnected';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    try {
      await this.authService.register(body);
      res.status(204).send();
    } catch (error: unknown) {
      res.status(400).json(error);
    }
  }

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    try {
      const token = await this.authService.login(body);
      res.status(200).send(token);
    } catch (error: unknown) {
      res.status(400).json(error);
    }
  }

  @Get('profile')
  @Public()
  @ApiBearerAuth()
  @UseGuards(MustBeConnectedGuard)
  getProfile(@GetUser() user: User) {
    return user;
  }
}
