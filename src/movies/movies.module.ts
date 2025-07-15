import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { GlobalModule } from 'src/global/global.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [GlobalModule, AuthModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
