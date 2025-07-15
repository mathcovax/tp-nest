import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { CreateMovieDto, UpdateMovieDto } from './dto/movie.dto';
import {
  MustBeConnectedGuard,
  GetUser,
} from 'src/auth/guards/mustBeConnected.guard';
import { User } from '@prisma/client';

@ApiTags('Movies')
@ApiBearerAuth()
@Controller('movies')
@UseGuards(MustBeConnectedGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Ajouter un film à sa watchlist' })
  async createMovie(
    @GetUser() user: User,
    @Body() createMovieDto: CreateMovieDto,
  ) {
    return this.moviesService.createMovie(user.id, createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer sa liste de films' })
  async getMyMovies(@GetUser() user: User) {
    return this.moviesService.getMyMovies(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un film par son ID' })
  async getMovieById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.moviesService.getMovieById(id, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un film' })
  async updateMovie(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.updateMovie(id, user.id, updateMovieDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un film' })
  async deleteMovie(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ) {
    return this.moviesService.deleteMovie(id, user.id);
  }
}
