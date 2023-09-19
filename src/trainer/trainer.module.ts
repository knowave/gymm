import { Module } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { TrainerResolver } from './trainer.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [TrainerResolver, TrainerService],
})
export class TrainerModule {}
