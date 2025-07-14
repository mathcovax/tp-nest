import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/global/prisma.service';
import { CryptService } from './crypt.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptService: CryptService,
    private readonly tokenService: TokenService,
  ) {}

  async register({ email, password }: { email: string; password: string }) {
    const hashedPassword = await this.cryptService.hashPassword(password);
    await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  async login({ email, password }: { email: string; password: string }) {
    const { id, password: hashedPassword } =
      await this.prisma.user.findFirstOrThrow({
        where: {
          email,
        },
      });

    const isMatch = await this.cryptService.comparePassword(
      password,
      hashedPassword,
    );

    if (!isMatch) {
      throw new Error('Wrong Password');
    }

    return this.tokenService.generateToken({
      userId: id,
    });
  }
}
