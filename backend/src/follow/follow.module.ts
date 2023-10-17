import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowResolver } from './follow.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [FollowResolver, FollowService],
})
export class FollowModule {}
