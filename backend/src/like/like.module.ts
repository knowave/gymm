import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from 'src/feed/entities/feed.entity';
import { Gym } from 'src/gym/entities/gym.entity';
import { Like } from './entities/like.entity';
import { Reply } from 'src/reply/entities/reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, Gym, Like, Reply])],
  providers: [LikeResolver, LikeService],
})
export class LikeModule {}
