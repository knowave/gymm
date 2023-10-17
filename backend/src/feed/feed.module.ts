import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedResolver } from './feed.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from './entities/feed.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, User])],
  providers: [FeedResolver, FeedService],
})
export class FeedModule {}
