import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/global/prisma.service';
import { CreateMovieDto, UpdateMovieDto } from './dto/movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMovie(userId: number, createMovieDto: CreateMovieDto) {
    return this.prisma.movie.create({
      data: {
        ...createMovieDto,
        userId,
      },
    });
  }

  async getMyMovies(userId: number) {
    return this.prisma.movie.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMovieById(id: number, userId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
      include: { user: { select: { id: true, email: true } } },
    });

    if (!movie) {
      throw new NotFoundException('Film non trouvé');
    }

    if (movie.userId !== userId) {
      throw new ForbiddenException("Vous n'avez pas accès à ce film");
    }

    return movie;
  }

  async updateMovie(
    id: number,
    userId: number,
    updateMovieDto: UpdateMovieDto,
  ) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Film non trouvé');
    }

    if (movie.userId !== userId) {
      throw new ForbiddenException("Vous n'avez pas accès à ce film");
    }

    return this.prisma.movie.update({
      where: { id },
      data: updateMovieDto,
    });
  }

  async deleteMovie(id: number, userId: number) {
    const movie = await this.prisma.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      throw new NotFoundException('Film non trouvé');
    }

    if (movie.userId !== userId) {
      throw new ForbiddenException("Vous n'avez pas accès à ce film");
    }

    return this.prisma.movie.delete({
      where: { id },
    });
  }
}
