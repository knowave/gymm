import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyResolver } from './reply.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Feed } from 'src/feed/entities/feed.entity';
import { Gym } from 'src/gym/entities/gym.entity';
import { Reply } from './entities/reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Feed, Gym, Reply])],
  providers: [ReplyResolver, ReplyService],
})
export class ReplyModule {}
