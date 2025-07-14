import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../services/token.service';
import { PrismaService } from 'src/global/prisma.service';
import { User } from '@prisma/client';

interface UserRequest extends Request {
  user?: User;
}

@Injectable()
export class MustBeConnectedGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<UserRequest>();
    const authHeader = request.headers['authorization'];

    if (
      !authHeader ||
      typeof authHeader !== 'string' ||
      !authHeader.startsWith('Bearer ')
    ) {
      throw new UnauthorizedException(
        'Authorization header missing or invalid',
      );
    }

    const payload = this.tokenService.verifyToken(
      authHeader.replace('Bearer ', ''),
    );

    if (!payload) {
      throw new UnauthorizedException(
        'Authorization header missing or invalid',
      );
    }

    const user = await this.prisma.user.findFirstOrThrow({
      where: {
        id: payload.userId,
      },
    });

    request.user = user;

    return true;
  }
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<UserRequest>();
    return request.user;
  },
);
