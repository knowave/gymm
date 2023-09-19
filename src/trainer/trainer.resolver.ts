import { Resolver } from '@nestjs/graphql';
import { TrainerService } from './trainer.service';

@Resolver()
export class TrainerResolver {
  constructor(private readonly trainerService: TrainerService) {}
}
