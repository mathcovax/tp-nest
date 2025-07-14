import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail()
  @Type(() => String)
  email: string;

  @ApiProperty()
  @IsString()
  @Type(() => String)
  password: string;
}
