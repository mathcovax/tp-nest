import {
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ description: 'Titre du film' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Description du film' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Genre du film' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({ description: 'Année de sortie' })
  @IsOptional()
  @IsInt()
  releaseYear?: number;

  @ApiPropertyOptional({
    description: 'Note personnelle (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;
}

export class UpdateMovieDto {
  @ApiPropertyOptional({ description: 'Titre du film' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Description du film' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Genre du film' })
  @IsOptional()
  @IsString()
  genre?: string;

  @ApiPropertyOptional({ description: 'Année de sortie' })
  @IsOptional()
  @IsInt()
  releaseYear?: number;

  @ApiPropertyOptional({
    description: 'Note personnelle (1-5)',
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;
}
