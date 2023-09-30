import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TrainerService } from './trainer.service';
import {
  CreateTrainerByUserInput,
  CreateTrainerByUserOutput,
} from './dto/create-trainer-by-user.input';

@Resolver()
export class TrainerResolver {
  constructor(private readonly trainerService: TrainerService) {}

  @Mutation(() => CreateTrainerByUserOutput)
  async createTrainerByUser(
    @Args('input') createTrainerByUserInput: CreateTrainerByUserInput,
  ): Promise<CreateTrainerByUserOutput> {
    return this.trainerService.createTrainerByUser(createTrainerByUserInput);
  }
}
