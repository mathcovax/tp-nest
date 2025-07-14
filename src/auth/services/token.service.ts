import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { z } from 'zod';

@Injectable()
export class TokenService {
  private readonly payloadSchema = z.object({
    userId: z.number(),
  });

  private readonly jwtSecret = process.env.JWT_SECRET || 'default_secret';

  generateToken(payload: z.infer<TokenService['payloadSchema']>): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '1h' });
  }

  verifyToken(token: string) {
    try {
      const content = jwt.verify(token, this.jwtSecret);
      return this.payloadSchema.parse(content);
    } catch {
      return null;
    }
  }
}
