import { Module } from '@nestjs/common';
import { GymService } from './gym.service';
import { GymResolver } from './gym.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gym } from './entities/gym.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gym, User])],
  providers: [GymResolver, GymService],
})
export class GymModule {}
