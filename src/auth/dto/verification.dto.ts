import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ description: 'Token de vérification email' })
  @IsString()
  token: string;
}

export class TwoFactorDto {
  @ApiProperty({ description: "Email de l'utilisateur" })
  @IsEmail()
  email: string;
}

export class VerifyTwoFactorDto {
  @ApiProperty({ description: "Email de l'utilisateur" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Code 2FA (6 chiffres)' })
  @IsString()
  @Length(6, 6)
  code: string;
}
